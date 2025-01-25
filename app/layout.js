import './styles.css';
import ProviderWrapper from './Providerwrapper';

export const metadata = {
  title: 'EV Charge - Find Charging Stations Near You',
  description: 'Locate and use EV charging stations with ease using our app.',
}


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
      <ProviderWrapper>
          {children}
      </ProviderWrapper>
      </body>
    </html>
  )
}