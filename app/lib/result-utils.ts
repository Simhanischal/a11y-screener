import { JSDOM } from "jsdom";
import axe from "axe-core";
import { NormalizedAxeResult } from "@/app/models/screen-results";
import { capitalize } from "@/app/lib/common-utils";
import createDOMPurify from "dompurify";
import { User } from "@auth0/nextjs-auth0/types";
import prisma from "@/lib/prisma";

function getViolationDescription(summary: string) {
  const ariaIndex = summary.indexOf("aria");
  const fallbackIndex = summary.indexOf("\n");
  const firstIndex = ariaIndex > 0 ? ariaIndex : fallbackIndex;
  const lastIndex = summary.indexOf("\n", firstIndex + 3);
  return summary
    .substring(firstIndex, lastIndex > 0 ? lastIndex : summary.length)
    .trim();
}

function normalizeAxeResults(axeResult: axe.AxeResults): NormalizedAxeResult[] {
  const normalizedResults = axeResult.violations.map((violation) => {
    const affectedNodes: string[] = [];
    violation.nodes.forEach((node) => {
      if (!affectedNodes.includes(node.html)) {
        affectedNodes.push(node.html);
      }
    });
    const normalizedValue = {
      severity: capitalize(violation.impact || "") || "Unknown",
      id: violation.id,
      title: violation.help,
      helpUrl: violation.helpUrl,
      wcag: violation.tags.filter((tag) => tag.startsWith("wcag")) ?? "",
      description: getViolationDescription(
        violation.nodes[0]?.failureSummary || ""
      ),
      affectedNodes,
    };
    return normalizedValue;
  });

  return normalizedResults;
}

export async function runAxe(html: string) {
  const dom = new JSDOM(html, {
    pretendToBeVisual: true,
    runScripts: "dangerously",
    resources: "usable",
  });
  const { window } = dom;

  axe.setup(window.document);

  const results = await axe.run(window.document, {
    resultTypes: ["violations", "passes"],
  });
  const normalizedResults = normalizeAxeResults(results);
  return normalizedResults;
}

export const sanitizeApiParam = (param: string) => {
  const dom = new JSDOM();
  const { window } = dom;
  const DOMPurify = createDOMPurify(window);
  return DOMPurify.sanitize(param);
};

export const persistResultsInDb = async (
  authUser: User,
  results: NormalizedAxeResult[],
  url: string
) => {
  try {
    const dbUserDetails = await prisma.user.findUnique({
      where: { email: authUser.email },
    });
    let dbUserId = dbUserDetails?.id;
    // If the user doesn't exist in DB, create the user in DB
    if (!dbUserId) {
      const newDbUser = await prisma.user.create({
        data: {
          name: authUser.name as string,
          email: authUser.email as string,
        },
      });
      dbUserId = newDbUser?.id;
    }
    const timestamp = Date.now();
    const newResult = await prisma.result.create({
      data: {
        timestamp,
        siteUrl: url,
        userId: dbUserId,
      },
    });
    results.forEach(async (result: NormalizedAxeResult) => {
      await prisma.violation.create({
        data: {
          title: result.title,
          helpUrl: result.helpUrl,
          description: result.description,
          severity: result.severity,
          wcag: result.wcag,
          affectedNodes: result.affectedNodes,
          resultId: newResult.id,
        },
      });
    });
  } catch {
    throw new Error();
  }
};
