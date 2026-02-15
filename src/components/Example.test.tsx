import { render, screen } from '@testing-library/react'

import { Example } from './Example'

describe('Example', () => {
  it('renders name correctly', () => {
    render(<Example name="World" />)
    expect(screen.getByText('Hello, World!')).toBeInTheDocument()
  })
})
