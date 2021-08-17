import Head from "next/head";

function useDocumentMetaData(title: string, description: string) {
  return (
    <Head>
      <title>{title} | Aktindo Blog</title>

      <link rel="shortcut icon" href="/logos/Aktindo.svg" type="image/x-icon" />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={window.location.href} />
      <meta property="og:image" content="/logos/Aktindo.svg" />
      <meta content="#4297BA" data-react-helmet="true" name="theme-color" />
    </Head>
  );
}

export { useDocumentMetaData };
