import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Dashboard from '../Dashboard.jsx/Dasboard';

describe('Dashboard Component', () => {
  it('renders the main dashboard sections', () => {
    render(<Dashboard />);
    
    // Check main headings
    expect(screen.getByText('تحليل الأخبار المزيفة')).toBeInTheDocument();
    expect(screen.getByText('تقرير تفصيلي عن مصداقية المحتوى')).toBeInTheDocument();
  });

  it('displays the credibility score correctly', () => {
    render(<Dashboard />);
    
    // The credibility score should be visible
    expect(screen.getByText('85%')).toBeInTheDocument();
    expect(screen.getByText('درجة المصداقية')).toBeInTheDocument();
  });

  it('shows content analysis metrics', () => {
    render(<Dashboard />);
    
    // Check content analysis section
    expect(screen.getByText('تحليل المحتوى')).toBeInTheDocument();
    expect(screen.getByText('لغة عاطفية')).toBeInTheDocument();
    expect(screen.getByText('65%')).toBeInTheDocument();
    expect(screen.getByText('محتوى واقعي')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('displays technical indicators', () => {
    render(<Dashboard />);
    
    // Check technical indicators section
    expect(screen.getByText('مؤشرات تقنية')).toBeInTheDocument();
    expect(screen.getByText('دقة لغوية')).toBeInTheDocument();
    expect(screen.getByText('90%')).toBeInTheDocument();
    expect(screen.getByText('تناسق الأسلوب')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument();
  });

  it('shows source metrics', () => {
    render(<Dashboard />);
    
    // Check source metrics section
    expect(screen.getByText('معلومات المصدر')).toBeInTheDocument();
    expect(screen.getByText('عمر النطاق')).toBeInTheDocument();
    expect(screen.getByText('5+ years')).toBeInTheDocument();
    expect(screen.getByText('مصداقية الكاتب')).toBeInTheDocument();
    expect(screen.getByText('High')).toBeInTheDocument();
  });

  it('renders all progress bars correctly', () => {
    render(<Dashboard />);
    
    // Check if all progress bars are rendered with correct widths
    const emotionalLanguageBar = screen.getByRole('progressbar', { name: /لغة عاطفية/i });
    expect(emotionalLanguageBar).toHaveStyle({ width: '65%' });

    const factualContentBar = screen.getByRole('progressbar', { name: /محتوى واقعي/i });
    expect(factualContentBar).toHaveStyle({ width: '75%' });
  });

  it('renders the circular progress indicator', () => {
    render(<Dashboard />);
    
    // Check if SVG elements for circular progress are present
    const circles = screen.getAllByRole('circle');
    expect(circles).toHaveLength(2); // Background circle and progress circle
    
    // Verify the progress circle has correct attributes
    const progressCircle = circles[1];
    expect(progressCircle).toHaveAttribute('stroke-dasharray', '350.8889');
    expect(progressCircle).toHaveAttribute('stroke-dashoffset');
  });
});