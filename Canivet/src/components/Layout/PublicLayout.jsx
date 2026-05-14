import { Navbar } from './Navbar'

export const PublicLayout = ({ children }) => (
  <div>
    <Navbar />
    <main>{children}</main>
  </div>
)