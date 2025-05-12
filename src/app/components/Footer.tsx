export default function Footer() {
    return (
        <footer className=" text-black py-4">
            <div className="container mx-auto text-center">
                <p>&copy; {new Date().getFullYear()} Mongkhonsiri</p>
            </div>
        </footer>
    );
}