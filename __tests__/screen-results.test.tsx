import ScreenResults from "@/app/components/screen-results";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

const results = [
  {
    severity: 'critical',
    id: 'button-name',
    helpUrl: 'https://www.helpurl.com',
    title: 'Buttons must have discernible text',
    wcag: ['wcag2a', 'wcag412'],
    description: 'aria-label attribute does not exist or is empty',
    affectedNodes: ['<button id="prev-tab" class="nav-button">', '<button id="next-tab" class="nav-button">'],
  },
  {
    severity: 'serioud',
    id: 'link-name',
    helpUrl: 'https://www.helpurl.com',
    title: 'Links must have discernible text',
    wcag: ['wcag2a', 'wcag244', 'wcag412'],
    description: 'aria-label attribute does not exist or is empty',
    affectedNodes: ['<a target="_blank" href="https://www.facebook.com/accessibe">', '<a target="_blank" href="https://www.instagram.com/accessibe_community">'],
  },
];

const props = {
  siteUrl: 'https://a11screener.com',
  screenResults: results,
}

const routerPush = jest.fn();

jest.mock('next/navigation', () => {
  return {
    useRouter: () => ({
      push: routerPush,
    }),
  }
});

jest.mock('react-syntax-highlighter/dist/esm/styles/hljs/dracula', () => ({
  "hljs-attribute": {
    "color": "#f1fa8c"
  },
}));

describe('ScreenResults', () => {
  it ('displays the site url correctly', () => {
    render(<ScreenResults {...props} />);
    const siteUrl = screen.getByText(props.siteUrl);
    expect(siteUrl).toBeInTheDocument();
  });

  it ('renders the edit url button', () => {
    render(<ScreenResults {...props} />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toBeEnabled();
  });

  it ('handles navigation upon edit button click', async () => {
    render(<ScreenResults {...props} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    await waitFor(() => {
      expect(routerPush).toHaveBeenCalledWith('/');
    });
  });
})