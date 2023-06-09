import './globals.css'

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head />
      <body>
        <div className="flex">
          <div className='flex-1'>
            {children}
          </div>
        </div>        
      </body>
    </html>
  )
}
