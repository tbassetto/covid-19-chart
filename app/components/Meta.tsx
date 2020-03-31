import Head from "next/head";

const Meta = ({ title }) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content="" />
      <meta property="og:type" content="website" />
      <meta name="og:title" property="og:title" content={title} />
      {/* <meta name="og:description" property="og:description" content="" /> */}
      <meta property="og:site_name" content={title} />
      <meta property="og:url" content="https://covid-19-chart.netlify.com" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      {/* <meta name="twitter:description" content={props.desc} /> */}
      <meta name="twitter:site" content="https://covid-19-chart.netlify.com" />
      <meta name="twitter:creator" content="Thomas Bassetto" />
      {/* <link rel="icon" type="image/png" href="/static/images/favicon.ico" /> */}
      {/* <link rel="apple-touch-icon" href="/static/images/favicon.ico" /> */}
      {/* <meta property="og:image" content="" /> */}
      {/* <meta name="twitter:image" content="" /> */}
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <link href="https://rsms.me/inter/inter.css" rel="stylesheet" />
      <link
        href="https://fonts.googleapis.com/css?family=Frank+Ruhl+Libre:700"
        rel="stylesheet"
      />
    </Head>
  );
};
export default Meta;
