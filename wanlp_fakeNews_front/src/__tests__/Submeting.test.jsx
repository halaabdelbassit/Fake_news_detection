import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SubmitNews from '../component/Submeting';

describe('SubmitNews Component', () => {
  it('renders the component correctly', () => {
    render(<SubmitNews />);
    
    // Check for main elements
    expect(screen.getByText('تحليل الأخبار المزيفة')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByText('تحليل الخبر')).toBeInTheDocument();
  });

  it('handles text input correctly', () => {
    render(<SubmitNews />);
    const textarea = screen.getByRole('textbox');
    
    fireEvent.change(textarea, { target: { value: 'Test news content' } });
    expect(textarea.value).toBe('Test news content');
  });

  it('enforces character limit', () => {
    render(<SubmitNews />);
    const textarea = screen.getByRole('textbox');
    const longText = 'a'.repeat(1600); // More than max 1500 chars
    
    fireEvent.change(textarea, { target: { value: longText } });
    expect(textarea.value.length).toBe(1500);
  });

  it('shows loading state during submission', async () => {
    render(<SubmitNews />);
    const textarea = screen.getByRole('textbox');
    const submitButton = screen.getByText('تحليل الخبر');
    
    // Enter text and submit
    fireEvent.change(textarea, { target: { value: 'Test news' } });
    fireEvent.click(submitButton);
    
    // Check loading state
    expect(screen.getByText('جاري التحليل...')).toBeInTheDocument();
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByText('تحليل الخبر')).toBeInTheDocument();
    }, { timeout: 2500 });
  });

  it('switches between text and link input types', () => {
    render(<SubmitNews />);
    const select = screen.getByRole('combobox');
    const textarea = screen.getByRole('textbox');
    
    // Switch to link input
    fireEvent.change(select, { target: { value: 'link' } });
    expect(textarea.placeholder).toContain('انسخ رابط الخبر');
    
    // Switch back to text input
    fireEvent.change(select, { target: { value: 'text' } });
    expect(textarea.placeholder).toContain('انسخ نص الخبر');
  });

  it('disables submit button when input is empty', () => {
    render(<SubmitNews />);
    const submitButton = screen.getByText('تحليل الخبر');
    
    expect(submitButton).toBeDisabled();
    
    // Add text
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Test news' } });
    
    expect(submitButton).not.toBeDisabled();
  });
});