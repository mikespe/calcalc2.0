import { render, screen, waitFor } from '@testing-library/react'
import Calendar from '../Calendar'
import '@testing-library/jest-dom'

// Mock fetch
global.fetch = jest.fn()

describe('Calendar Component', () => {
  const mockOnDateSelect = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(global.fetch as jest.Mock).mockResolvedValue({
      json: async () => ({
        calorieLogs: [],
        weightLogs: [],
        activityLogs: [],
      }),
    })
  })

  it('should render calendar with month navigation', async () => {
    render(<Calendar onDateSelect={mockOnDateSelect} />)

    await waitFor(() => {
      expect(screen.getByText(/january|february|march|april|may|june|july|august|september|october|november|december/i)).toBeInTheDocument()
    })

    // Check for day headers
    expect(screen.getByText('Sun')).toBeInTheDocument()
    expect(screen.getByText('Mon')).toBeInTheDocument()
  })

  it('should show loading state initially', () => {
    render(<Calendar onDateSelect={mockOnDateSelect} />)
    expect(screen.getByText('Loading calendar...')).toBeInTheDocument()
  })

  it('should display calendar days', async () => {
    render(<Calendar onDateSelect={mockOnDateSelect} />)

    await waitFor(() => {
      // Should render some day numbers
      const dayNumbers = screen.getAllByText(/\d+/)
      expect(dayNumbers.length).toBeGreaterThan(0)
    })
  })

  it('should call onDateSelect when a day is clicked', async () => {
    render(<Calendar onDateSelect={mockOnDateSelect} />)

    await waitFor(() => {
      const firstDay = screen.getAllByText(/^[1-9]$|^1[0-9]$|^2[0-9]$|^3[01]$/)[0]
      firstDay.click()
    })

    expect(mockOnDateSelect).toHaveBeenCalled()
  })

  it('should display legend', async () => {
    render(<Calendar onDateSelect={mockOnDateSelect} />)

    await waitFor(() => {
      expect(screen.getByText('Calorie Log')).toBeInTheDocument()
      expect(screen.getByText('Weight Log')).toBeInTheDocument()
      expect(screen.getByText('Activity Log')).toBeInTheDocument()
    })
  })
})

