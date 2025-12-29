import Navbar from "@/app/components/navbar";
import { fireEvent, render, screen } from "@testing-library/react";
import { useUser } from "@auth0/nextjs-auth0";

const mockUser = {
  sub: "Sub",
  name: "Test User",
  nickname: "test",
};

jest.mock('@auth0/nextjs-auth0', () => ({
  useUser: jest.fn(),
}))

const testPathName = '/history';

jest.mock('next/navigation', () => {
  return {
    usePathname: () => testPathName,
  }
});

describe('Navbar', () => {
  it ('renders the correct navbar items for logged out user', () => {
    (useUser as jest.Mock).mockImplementation(() => ({ user: undefined }));
    render(<Navbar />);
    const userProfile = screen.getByText('Login');
    expect(userProfile).toBeInTheDocument();
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
  });
  
  it ('renders the correct navbar items for logged in user', () => {
    (useUser as jest.Mock).mockImplementation(() => ({ user: mockUser }));
    render(<Navbar />);
    const userProfile = screen.getByText('Test');
    expect(userProfile).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    fireEvent.click(userProfile);
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });
});