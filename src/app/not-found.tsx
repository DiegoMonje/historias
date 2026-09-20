import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found">
      <span>404</span>
      <h1>Esta historia no estaba escrita.</h1>
      <p>La página que buscas ha desaparecido o nunca llegó a publicarse.</p>
      <Link className="button button--light" href="/historias">
        Volver a la biblioteca
      </Link>
    </main>
  );
}
