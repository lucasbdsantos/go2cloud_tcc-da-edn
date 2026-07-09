export function Footer() {
  return (
    <footer className="relative z-10 w-full py-2xl bg-surface-container-lowest border-t border-outline-variant/10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-lg px-lg max-w-container mx-auto">
        <div className="flex flex-col gap-md">
          <div className="text-headline-md font-bold text-primary">GO2Cloud</div>
          <p className="text-body-sm text-on-surface-variant opacity-80">
            Capacitando a próxima geração de arquitetos e engenheiros de nuvem com treinamento prático e mentoria real.
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-md">Explore</h4>
          <ul className="space-y-sm text-body-sm text-on-surface-variant">
            <li><a className="hover:text-secondary-container transition-colors" href="#">Cloud Infrastructure</a></li>
            <li><a className="hover:text-secondary-container transition-colors" href="#">Developer Tools</a></li>
            <li><a className="hover:text-secondary-container transition-colors" href="#">Security & Identity</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-md">Comunidade</h4>
          <ul className="space-y-sm text-body-sm text-on-surface-variant">
            <li><a className="hover:text-secondary-container transition-colors" href="#">Cloud Careers</a></li>
            <li><a className="hover:text-secondary-container transition-colors" href="#">Open Source</a></li>
            <li><a className="hover:text-secondary-container transition-colors" href="#">Events</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-md">Legal</h4>
          <ul className="space-y-sm text-body-sm text-on-surface-variant">
            <li><a className="hover:text-secondary-container transition-colors" href="#">Privacy Policy</a></li>
            <li><a className="hover:text-secondary-container transition-colors" href="#">Terms of Service</a></li>
            <li><a className="hover:text-secondary-container transition-colors" href="#">Institutional Contact</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-container mx-auto px-lg mt-2xl pt-lg border-t border-outline-variant/5 text-center md:text-left">
        <p className="text-body-sm text-on-surface-variant">© 2024 GO2Cloud AWS Training. All rights reserved.</p>
      </div>
    </footer>
  );
}
