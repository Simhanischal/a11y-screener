import CodeFixModal from "@/app/components/code-fix-modal";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

const props = {
  description: 'Test Description',
  affectedCode: '<button>Test</button>',
  generateFix: jest.fn(),
  isGenerationLoading: false,
  generationResult: { fix: '<button aria-label="Test button">Test</button>'},
  setGenerationResult: jest.fn(),
}

const openModal = () => {
  render(<CodeFixModal {...props} />);
  const generateButton = screen.getByRole('button');
  fireEvent.click(generateButton);
}

afterAll(() => {
  jest.clearAllMocks();
})

describe('CodeFixModal', () => {
  it ('displays the modal elements properly', async () => {
    openModal();
    await waitFor(() => {
      const issueDescription = screen.getByText(props.description);
      const [copyCodeFixButton, cancelButton] = screen.getAllByRole('button');
      expect(issueDescription).toBeInTheDocument();
      expect(cancelButton).toHaveTextContent('Cancel');
      expect(copyCodeFixButton).toHaveTextContent('Copy Code Fix');
    });
  });

  it ('closes the modal upon cancel', async () => {
    openModal();
    await waitFor(() => {
      const cancelButton = screen.getAllByRole('button')[1];
      fireEvent.click(cancelButton);
      expect(props.setGenerationResult).toHaveBeenCalledWith({ fix: '', reason: '' });
    });
  });

  // Todo: Fix window mocking
  xit ('copies the code fix upon copy button click', async () => {
    openModal();
    await waitFor(() => {
      const copyCodeFixButton = screen.getAllByRole('button')[0];
      fireEvent.click(copyCodeFixButton);
      // expect(global.window.navigator.clipboard.writeText).toHaveBeenCalledWith(props.generationResult.fix);
    });
  });

  it ('handles when there is no code fix', async () => {
    const newProps = { ...props, generationResult: { reason: 'Reason' } };
    render(<CodeFixModal {...newProps} />);
    const generateButton = screen.getByRole('button');
    fireEvent.click(generateButton);
    await waitFor(() => {
      const reason = screen.getByText(newProps.generationResult.reason);
      expect(reason).toBeInTheDocument();
    });
  });

  it ('handles error', async () => {
    const newProps = { ...props, generationResult: { } };
    render(<CodeFixModal {...newProps} />);
    const generateButton = screen.getByRole('button');
    fireEvent.click(generateButton);
    await waitFor(() => {
      const errorText = screen.getByText('Something went wrong! Please try again later');
      expect(errorText).toBeInTheDocument();
    });
  });
})