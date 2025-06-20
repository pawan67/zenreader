const Footer = () => {
  return (
    <footer className="w-full      py-6 border-t bg-background/80 mt-8">
      <div className=" max-w-4xl  text-center mx-auto px-5">
        <div className="">
          <p className=" text-sm  text-muted-foreground">
            Built with Next.js.{" "}
            <a
              href="https://pawan67.vercel.app?ref=zenreader"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline hover:text-primary font-medium"
            >
              Pawan Tamada
            </a>{" "}
            | © {new Date().getFullYear()} Copyright All rights reserved.{" "}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
