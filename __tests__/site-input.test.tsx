import SiteInput from "@/app/components/site-input";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

const props = {
  siteUrl: '',
  setSiteUrl: jest.fn(),
  inputError: '',
  setInputError: jest.fn(),
  handleScreen: jest.fn(),
  isScreenButtonLoading: false,
}

describe('SiteInput', () => {
  it ('renders the input field', () => {
    render(<SiteInput {...props} />);
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  it ('renders the screen button', () => {
    render(<SiteInput {...props} />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it ('handles input change', async () => {
    render(<SiteInput {...props} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Example' } });
    await waitFor(() => {
      expect(props.setSiteUrl).toHaveBeenCalled();
    });
  });

  it ('displays error when the input has been cleared', async () => {
    const newProps = { ...props, siteUrl: 'URL' };
    render(<SiteInput {...newProps} />);
    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button');
    expect(button).toBeEnabled();
    fireEvent.change(input, { target: { value: '' } });
    await waitFor(() => {
      expect(props.setInputError).toHaveBeenCalledWith('URL cannot be empty');
    })
  });

  it ('handles screening when clicked on screen button', async () => {
    const newProps = { ...props, siteUrl: 'URL' };
    render(<SiteInput {...newProps} />);
    const button = screen.getByRole('button');
    expect(button).toBeEnabled();
    fireEvent.click(button);
    await waitFor(() => {
      expect(props.handleScreen).toHaveBeenCalled();
    })
  });
})