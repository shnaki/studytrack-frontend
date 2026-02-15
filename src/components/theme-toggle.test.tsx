import { fireEvent, render, screen } from '@testing-library/react'

import { ThemeToggle } from './theme-toggle'

const mockSetTheme = vi.fn()
let mockTheme = 'system'

vi.mock('next-themes', () => ({
  useTheme: () => ({ theme: mockTheme, setTheme: mockSetTheme }),
}))

vi.mock('@/components/ui/sidebar', () => ({
  SidebarMenuButton: ({
    children,
    onClick,
    tooltip,
    disabled,
    ...props
  }: {
    children: React.ReactNode
    onClick?: () => void
    tooltip?: string
    disabled?: boolean
  }) => (
    <button onClick={onClick} title={tooltip} disabled={disabled} {...props}>
      {children}
    </button>
  ),
}))

vi.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuTrigger: ({
    children,
  }: {
    children: React.ReactNode
    asChild?: boolean
  }) => <div>{children}</div>,
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuItem: ({
    children,
    onClick,
  }: {
    children: React.ReactNode
    onClick?: () => void
  }) => (
    <button role="menuitem" onClick={onClick}>
      {children}
    </button>
  ),
}))

describe('ThemeToggle', () => {
  beforeEach(() => {
    mockTheme = 'system'
    mockSetTheme.mockClear()
  })

  it('現在のテーマがトリガーに表示される', () => {
    render(<ThemeToggle />)
    expect(screen.getByTitle('システム')).toBeInTheDocument()
  })

  it('全テーマの選択肢が表示される', () => {
    render(<ThemeToggle />)
    expect(screen.getAllByText('システム')).toHaveLength(2) // trigger + menu item
    expect(screen.getByText('ライト')).toBeInTheDocument()
    expect(screen.getByText('ダーク')).toBeInTheDocument()
  })

  it('ライトを選択するとsetThemeが呼ばれる', () => {
    render(<ThemeToggle />)
    fireEvent.click(screen.getByText('ライト'))
    expect(mockSetTheme).toHaveBeenCalledWith('light')
  })

  it('ダークを選択するとsetThemeが呼ばれる', () => {
    render(<ThemeToggle />)
    fireEvent.click(screen.getByText('ダーク'))
    expect(mockSetTheme).toHaveBeenCalledWith('dark')
  })

  it('システムを選択するとsetThemeが呼ばれる', () => {
    mockTheme = 'dark'
    render(<ThemeToggle />)
    fireEvent.click(screen.getByText('システム'))
    expect(mockSetTheme).toHaveBeenCalledWith('system')
  })
})
