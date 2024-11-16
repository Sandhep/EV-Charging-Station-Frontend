// app/dashboard/layout.js
export default function DashboardLayout({ children }) {
    return (
      <div>
        <nav>
          <ul>
            <li><a href="/dashboard">Home</a></li>
            <li><a href="/dashboard/settings">Settings</a></li>
          </ul>
        </nav>
        <div>{children}</div>
      </div>
    );
  }
  