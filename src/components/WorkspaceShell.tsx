import type { ReactNode } from 'react';
import { Icon } from './Icon';
import { BrandMark } from './BrandMark';

export function WorkspaceShell({ children }: { children: ReactNode }) {
  return (
    <div className="workspace">
      <a className="skip-link" href="#main">
        Skip to runs
      </a>
      <aside className="sidebar">
        <a className="brand" href="./" aria-label="RunForge — all runs">
          <BrandMark />
          RunForge
        </a>
        <div className="workspace-label">
          <span className="workspace-avatar">D</span>
          <div>
            <strong>Demo workspace</strong>
            <span>Personal workspace</span>
          </div>
        </div>
        <nav aria-label="Primary navigation">
          <p className="eyebrow">WORKSPACE</p>
          <a className="nav-active" href="#main" aria-current="page">
            <Icon name="runs" />
            Runs
            <Icon name="arrow" />
          </a>
        </nav>
        <div className="sidebar-bottom">
          <p>
            Every run.
            <br />
            <span>Full context.</span>
          </p>
          <span className="sidebar-description">
            From the first log line
            <br />
            to the final result.
          </span>
          <div className="demo-label">
            <span />
            Demo workspace
          </div>
        </div>
      </aside>
      <div className="main-shell">
        <div className="ambient-glow" aria-hidden="true">
          <span className="ambient-beam ambient-beam-1" />
          <span className="ambient-beam ambient-beam-2" />
          <span className="ambient-beam ambient-beam-3" />
          <span className="ambient-beam ambient-beam-4" />
          <span className="ambient-beam ambient-beam-5" />
          <span className="ambient-beam ambient-beam-6" />
          <span className="ambient-beam ambient-beam-7" />
        </div>
        <header className="topbar">
          <div className="breadcrumbs">
            <span>Workspace</span>
            <span className="breadcrumb-slash">/</span>
            <strong>Runs</strong>
          </div>
          <span className="local-label">
            <span />
            Local data
          </span>
        </header>
        <main id="main" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  );
}
