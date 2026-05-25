import { getBooks } from '@/lib/books';

export default async function Home() {
    const books = await getBooks();

    return (
        <main className="p-8">
            <h1 className="text-3xl font-bold">Bookstore</h1>

            <div className="mt-6 grid gap-4">
                {books.map((book: any) => (
                    <div key={book.id} className="border p-4 rounded">
                        <h2 className="text-xl font-semibold">{book.title}</h2>
                        <p>{book.author}</p>
                        <p>${book.price}</p>
                    </div>
                ))}
            </div>
        </main>
    );
}