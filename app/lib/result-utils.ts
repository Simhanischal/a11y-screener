import { JSDOM } from 'jsdom';
import axe from 'axe-core';
import { NormalizedAxeResult } from '@/app/models/screen-results';
import { capitalize } from '@/app/lib/common-utils';

function getViolationDescription(summary: string) {
  const ariaIndex = summary.indexOf('aria');
  const fallbackIndex = summary.indexOf('\n');
  const firstIndex = ariaIndex > 0 ? ariaIndex: fallbackIndex;
  const lastIndex = summary.indexOf('\n', firstIndex + 3);
  return summary.substring(firstIndex, (lastIndex > 0) ? lastIndex : summary.length).trim();
}

function normalizeAxeResults(axeResult: axe.AxeResults): NormalizedAxeResult[] {
  const normalizedResults = axeResult.violations.map(violation => {
    const affectedNodes: string[] = [];
    violation.nodes.forEach(node => {
      if (!affectedNodes.includes(node.html)) {
        affectedNodes.push(node.html);
      }
    });
    const normalizedValue = {
      severity: capitalize(violation.impact || '') || 'Unknown',
      id: violation.id,
      title: violation.help,
      wcag: violation.tags.filter(tag => tag.startsWith('wcag')) ?? '',
      description: getViolationDescription(violation.nodes[0]?.failureSummary || ''),
      affectedNodes,
    };
    // const violatedNodeResult: NormalizedAxeResult[] = [];
    // violation.nodes.forEach(node => {
    //   if (!affectedNodes.includes(node.html)) {
    //     violatedNodeResult.push({
    //       ...baseResult,
    //       affected_html: node.html,
    //     });
    //     affectedNodes.push(node.html);
    //   }
    // });
    // return violatedNodeResult;
    return normalizedValue;
  });

  return normalizedResults;
}

export async function runAxe(html: string) {
  const dom = new JSDOM(html, {
    pretendToBeVisual: true,
    runScripts: 'dangerously',
    resources: 'usable',
  });
  const { window } = dom;

  axe.setup(window.document);

  const results = await axe.run(window.document, {
    resultTypes: ['violations', 'passes'],
  });
  // return results;
  const normalizedResults = normalizeAxeResults(results);
  return normalizedResults;
}