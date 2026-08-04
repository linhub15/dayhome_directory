const faqs = [
  {
    question: "What's the difference between dayhomes and daycares?",
    answer: [
      "Dayhomes are run from the provider's home with a smaller number of children, which creates a more family-like environment and more flexibility in daily routines. Daycares operate in a dedicated facility and usually have larger teams, larger groups of children, and follows more structured programming.",
    ],
  },
  {
    question:
      "What's the difference between licensed and unlicensed childcare in Alberta?",
    answer: [
      "Licensed childcare in Alberta is monitored by the government and must meet specific standards, including staff ratios, training, programming, and regular inspections. Unlicensed childcare does not go through the same oversight, so operators have more flexibility but are not formally monitored.",
      "Licensed programs also allow for larger groups, while unlicensed providers can only care for a small number of children.",
    ],
  },
  {
    question: "What are the different types of programs?",
    answer: [
      "Montessori focuses on child-led learning with hands-on activities that promote independence.",
      "Reggio Emilia emphasizes creativity, exploration, and collaboration through projects based on children's interests.",
      "In Emergent Curriculum programs, children's learning is guided by their interests and explored through play.",
      "Academic Programs follow lesson plans that build early academic skills like letters, numbers, and routines. ",
    ],
  },
] as const;

export function Faq() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-24 sm:pt-32 lg:px-8" id="faq">
      <div className="py-8">
        <h2 className="text-3xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-4xl">
          Frequently asked questions
        </h2>
      </div>
      <dl className="space-y-10">
        {faqs.map((faq) => (
          <div key={faq.question}>
            <dt className="text-base/7 font-semibold text-gray-900">
              {faq.question}
            </dt>
            <dd className="mt-2 text-base/7 text-gray-600 space-y-4">
              {faq.answer.map((p, index) => (
                <p key={index}>{p}</p>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
