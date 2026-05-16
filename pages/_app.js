import '../styles/globals.css'
import '../styles/theme.css'
import Script from 'next/script'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Script id="clarity-script" strategy="afterInteractive">
        {`(function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "wrtl0mn30e");`}
      </Script>
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-GZ2B6D9BBM" strategy="afterInteractive" />
      <Script id="gtag-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-GZ2B6D9BBM');`}
      </Script>
      <Component {...pageProps} />
    </>
  )
}
