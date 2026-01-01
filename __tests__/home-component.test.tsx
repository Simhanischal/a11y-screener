import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import HomeComponent from '@/app/components/home';

const routerPush = jest.fn();

jest.mock('next/navigation', () => {
  return {
    useRouter: () => ({
      push: routerPush,
    }),
  }
});

describe('HomeComponent', () => {
  it("renders the header correctly", () => {
    render(<HomeComponent url='' />);
    const heading1 = screen.getByText("Screen your site for a11y issues");
    const heading2 = screen.getByText("Generate AI powered code fixes");
    expect(heading1).toBeInTheDocument();
    expect(heading2).toBeInTheDocument();
  });

  it("displays the site url in input field if present in search params", () => {
    render(<HomeComponent url='https://google.com' />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveDisplayValue('https://google.com');
  });

  it("handles invalid site url", async () => {
    render(<HomeComponent url='' />);
    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button');
    fireEvent.change(input, { target: { value: 'Example' } });
    await waitFor(() => {
      fireEvent.click(button);
    });
  });

  it("handles valid site url", async () => {
    const siteUrl = 'https://a11screener.com';
    render(<HomeComponent url='' />);
    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button');
    fireEvent.change(input, { target: { value: siteUrl } });
    await waitFor(() => {
      fireEvent.click(button);
    });
    await waitFor(() => {
      expect(routerPush).toHaveBeenCalledWith(`/results?url=${siteUrl}`);
    });
  });
});