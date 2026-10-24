import Link from "next/link";

export default function NotFound() {
  return <div className="shell section"><div className="empty-state"><div><p className="eyebrow">404</p><h1 className="section-title">This layer is missing.</h1><p className="muted">The page may have moved, or it was never printed in the first place.</p><Link className="button button-primary" href="/">Back to MIO Studio</Link></div></div></div>;
}
