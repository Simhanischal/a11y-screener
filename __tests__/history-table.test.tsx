import HistoryTable from "@/app/components/history-table";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

const props = {
  data: [
    {
      id: 1,
      siteUrl: 'https://google.com',
      timestamp: 'Dec 27, 2025 9:06 PM',
      userId: 2,
    },
    {
      id: 2,
      siteUrl: 'https://netflix.com',
      timestamp: 'Dec 28, 2025 6:34 PM',
      userId: 2,
    }
  ]
}

const testPathName = '/history';

jest.mock('next/navigation', () => {
  return {
    usePathname: () => testPathName,
  }
});

describe('HistoryTable', () => {
  it ('renders the correct data in table', () => {
    render(<HistoryTable {...props} />);
    expect(screen.getByText('https://google.com')).toBeInTheDocument();
    expect(screen.getByText(props.data[0].timestamp)).toBeInTheDocument();
    expect(screen.getByText('https://netflix.com')).toBeInTheDocument();
    expect(screen.getByText(props.data[1].timestamp)).toBeInTheDocument();
    expect(screen.getAllByText('View')[0]).toBeInTheDocument();
  });

  it ('filters the data in table', async () => {
    render(<HistoryTable {...props} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'google' } });
    await waitFor(() => {
      expect(screen.getByText('https://google.com')).toBeInTheDocument();
      expect(screen.getByText(props.data[0].timestamp)).toBeInTheDocument();
      expect(screen.queryByText('https://netflix.com')).not.toBeInTheDocument();
      expect(screen.queryByText(props.data[1].timestamp)).not.toBeInTheDocument();
      expect(screen.getAllByText('View')[0]).toBeInTheDocument();
    });
  });
});