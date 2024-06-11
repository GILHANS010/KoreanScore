import { render, screen } from '@testing-library/react';
import JeongganboEditor from './App';

test('renders title', () => {
    render(<JeongganboEditor />);
    const titleElement = screen.getByText(/제목/i);
    expect(titleElement).toBeInTheDocument();
});

test('handles note conversion correctly', () => {
    const note = '황';
    const result = convertNotes(note);
    expect(result).toBe('黃');
});
