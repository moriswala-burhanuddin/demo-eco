export default function ContactPage() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center max-w-2xl mx-auto py-20">
      <h1 className="font-heading text-5xl uppercase mb-6">Contact Us</h1>
      <p className="text-muted-foreground mb-12">
        Have a question about your order, our products, or anything else? We'd love to hear from you.
      </p>
      
      <div className="w-full space-y-6 text-left border border-border p-8 bg-secondary shadow-[8px_8px_0px_0px_rgba(18,18,18,1)]">
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest mb-2">Name</label>
          <input type="text" className="w-full bg-background border border-border h-12 px-4 focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Your Name" />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest mb-2">Email</label>
          <input type="email" className="w-full bg-background border border-border h-12 px-4 focus:outline-none focus:ring-2 focus:ring-primary" placeholder="your@email.com" />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest mb-2">Message</label>
          <textarea className="w-full bg-background border border-border p-4 h-32 focus:outline-none focus:ring-2 focus:ring-primary" placeholder="How can we help?"></textarea>
        </div>
        <button className="w-full h-14 bg-foreground text-background font-bold uppercase tracking-widest text-sm hover:-translate-y-1 transition-transform cursor-pointer border border-border shadow-[4px_4px_0px_0px_rgba(18,18,18,0.3)]">
          Send Message
        </button>
      </div>
    </div>
  );
}
