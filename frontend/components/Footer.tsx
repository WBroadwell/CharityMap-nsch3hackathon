

export default function Footer() {
    return (
        <footer className="w-full rounded-lg p-4 mt-8 text-center">
        <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Charity Map. All rights reserved.
        </p>
        </footer>
    );
    }