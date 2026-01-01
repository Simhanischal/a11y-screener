import HistoryTable from "@/app/components/history-table";
import { convertEpochToDateTime } from "@/app/lib/common-utils";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

const props = {
  data: [
    {
      id: 1,
      siteUrl: 'https://google.com',
      timestamp: 1767257105783,
      userId: 2,
    },
    {
      id: 2,
      siteUrl: 'https://netflix.com',
      timestamp: 1767262385164,
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
    expect(screen.getByText(convertEpochToDateTime(props.data[0].timestamp))).toBeInTheDocument();
    expect(screen.getByText('https://netflix.com')).toBeInTheDocument();
    expect(screen.getByText(convertEpochToDateTime(props.data[1].timestamp))).toBeInTheDocument();
    expect(screen.getAllByText('View')[0]).toBeInTheDocument();
  });

  it ('filters the data in table', async () => {
    render(<HistoryTable {...props} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'google' } });
    await waitFor(() => {
      expect(screen.getByText('https://google.com')).toBeInTheDocument();
      expect(screen.getByText(convertEpochToDateTime(props.data[0].timestamp))).toBeInTheDocument();
      expect(screen.queryByText('https://netflix.com')).not.toBeInTheDocument();
      expect(screen.queryByText(convertEpochToDateTime(props.data[1].timestamp))).not.toBeInTheDocument();
      expect(screen.getAllByText('View')[0]).toBeInTheDocument();
    });
  });
});