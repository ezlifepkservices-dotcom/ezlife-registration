const services = [
  {
    number: "01",
    title: "Umrah",
    description: "Premium Umrah membership programs.",
  },
  {
    number: "02",
    title: "Family Tours",
    description: "Family travel opportunities.",
  },
  {
    number: "03",
    title: "Home Appliances",
    description: "Easy access to quality home appliances.",
  },
  {
    number: "04",
    title: "Property & Homes",
    description: "Property and home ownership opportunities.",
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="bg-[#0B1222] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <p className="font-semibold uppercase tracking-widest text-violet-400">
            Our Services
          </p>

          <h2 className="mt-4 text-4xl font-black text-white sm:text-5xl">
            Everything in One Platform
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-slate-400">
            EZ Life provides multiple lifestyle services through one premium
            membership ecosystem.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {services.map((service) => (
            <div
              key={service.title}
              className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-violet-500"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-[#6D3BFF] to-[#172B63] text-lg font-black text-white">
                {service.number}
              </div>

              <h3 className="mt-8 text-2xl font-bold text-white">
                {service.title}
              </h3>

              <p className="mt-4 leading-7 text-slate-400">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}