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
    render(<HomeComponent />);
    const heading11 = screen.getByText("Screen your site for a11y issues");
    const heading2 = screen.getByText("Generate AI powered code fixes");
    expect(heading11).toBeInTheDocument();
    expect(heading2).toBeInTheDocument();
  });

  it("handles invalid site url", async () => {
    render(<HomeComponent />);
    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button');
    fireEvent.change(input, { target: { value: 'Example' } });
    await waitFor(() => {
      fireEvent.click(button);
    });
  });

  it("handles valid site url", async () => {
    const siteUrl = 'https://a11screener.com';
    render(<HomeComponent />);
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