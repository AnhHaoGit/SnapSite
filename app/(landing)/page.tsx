import Link from 'next/link'


export default function Landing() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-4">Welcome to SnapSite!</h1>
      <p className="text-lg mb-8">
        Create web pages easily with our built-in components.
      </p>

      <Link href='register' className="button-blue px-5 py-2 rounded-lg ">Get Started</Link>
    </div>
  );
}
