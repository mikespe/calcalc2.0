import { render, screen, waitFor } from '@testing-library/react'
import Header from '../Header'
import '@testing-library/jest-dom'

// Mock fetch
global.fetch = jest.fn()

describe('Header Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render CalCalc logo', () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
    })

    render(<Header />)
    expect(screen.getByText('CalCalc')).toBeInTheDocument()
  })

  it('should show navigation links', () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
    })

    render(<Header />)

    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Calendar')).toBeInTheDocument()
    expect(screen.getByText('Nutrition Search')).toBeInTheDocument()
  })

  it('should show Sign In button when user is not authenticated', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
    })

    render(<Header />)

    await waitFor(() => {
      expect(screen.getByText('Sign In')).toBeInTheDocument()
    })
  })

  it('should show user welcome message and logout when authenticated', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
      }),
    })

    render(<Header />)

    await waitFor(() => {
      expect(screen.getByText(/Welcome, Test User/i)).toBeInTheDocument()
      expect(screen.getByText('Logout')).toBeInTheDocument()
    })
  })

  it('should toggle mobile menu when hamburger is clicked', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
    })

    render(<Header />)

    const menuButton = screen.getByLabelText('Toggle menu')
    menuButton.click()

    // Mobile menu items should be visible
    expect(screen.getByText('Home')).toBeInTheDocument()
  })
})

