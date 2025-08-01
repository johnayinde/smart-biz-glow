import { Link } from "react-router-dom";

export function PublicFooter() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <span className="text-2xl font-bold text-primary">InvoiceApp</span>
            <p className="text-muted-foreground">
              Simplifying invoice management for businesses worldwide.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/#features" className="hover:text-foreground transition-colors">Features</a></li>
              <li><a href="/#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
              <li><Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link></li>
              <li><Link to="/dashboard" className="hover:text-foreground transition-colors">Templates</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-foreground transition-colors">About</Link></li>
              <li><span className="text-muted-foreground/50">Blog (Coming Soon)</span></li>
              <li><span className="text-muted-foreground/50">Careers (Coming Soon)</span></li>
              <li><Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/contact" className="hover:text-foreground transition-colors">Help & Support</Link></li>
              <li><span className="text-muted-foreground/50">Documentation (Coming Soon)</span></li>
              <li><span className="text-muted-foreground/50">Privacy Policy (Coming Soon)</span></li>
              <li><span className="text-muted-foreground/50">Terms of Service (Coming Soon)</span></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 InvoiceApp. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}