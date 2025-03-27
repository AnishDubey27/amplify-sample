import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders the Cosmic Knowledge Base title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Cosmic Knowledge Base/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders the warning message when using static articles', () => {
  render(<App />);
  const warningMessage = screen.queryByText(/Our cosmic data stream got sucked into a black hole/i);
  expect(warningMessage).toBeNull(); // Initially, it should not be present
});

test('renders the timer', () => {
  render(<App />);
  const timerElement = screen.getByText(/T-/i); // Assuming the timer starts with "T-"
  expect(timerElement).toBeInTheDocument();
});

test('renders at least one article card', async () => {
  render(<App />);
  const articleCards = await screen.findAllByRole('heading', { level: 3 }); // Assuming article categories are <h3>
  expect(articleCards.length).toBeGreaterThan(0);
});
