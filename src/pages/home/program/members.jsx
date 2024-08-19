const teamMembers = [
  {
    name: "Bonnie Green",
    role: "CEO & Web Developer",
    description:
      "Bonnie drives the technical strategy of the Flowbite platform and brand.",
    image:
      "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/bonnie-green.png",
    links: [
      { href: "/landing/program/profile", icon: "facebook" },
      { href: "/landing/program/profile", icon: "twitter" },
      { href: "/landing/program/profile", icon: "github" },
      { href: "/landing/program/profile", icon: "dribbble" },
    ],
  },
  {
    name: "Jese Leos",
    role: "CEO ",
    description:
      "Jese drives the technical strategy of the Flowbite platform and brand.",
    image:
      "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/jese-leos.png",
    links: [
      { href: "/landing/program/profile", icon: "facebook" },
      { href: "/landing/program/profile", icon: "twitter" },
      { href: "/landing/program/profile", icon: "github" },
      { href: "/landing/program/profile", icon: "dribbble" },
    ],
  },
];

export default function LandingMembersPage() {
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center mb-8 lg:mb-16">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
            Our Latest Members
          </h2>
          <p className="font-light text-gray-500 lg:mb-16 sm:text-xl dark:text-gray-400">
            Please welcome our latest members
          </p>
        </div>

        <div className="grid gap-12 mb-6 lg:mb-16 md:grid-cols-2">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="items-center bg-gray-800 rounded-lg shadow sm:flex dark:bg-gray-100 dark:border-gray-700"
            >
              <a href={member.links[0].href}>
                <img
                  className="w-full rounded-lg sm:rounded-none sm:rounded-l-lg pl-1"
                  src={member.image}
                  alt={`${member.name} Avatar`}
                />
              </a>
              <div className="p-5">
                <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                  <a href={member.links[0].href}>{member.name}</a>
                </h3>
                <span className="text-gray-400 dark:text-gray-400">
                  {member.role}
                </span>
                <p className="mt-3 mb-4 font-light text-gray-500 dark:text-gray-400">
                  {member.description}
                </p>
                <ul className="flex space-x-4 sm:mt-0">
                  {member.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href={link.href}
                        className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
                      >
                        {getIcon(link.icon)}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function getIcon(iconName) {
  switch (iconName) {
    case "facebook":
      return (
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
            clipRule="evenodd"
          />
        </svg>
      );
    case "twitter":
      return (
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
        </svg>
      );
    case "github":
      return (
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.338 1.91-1.296 2.748-1.026 2.748-1.026.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.338 4.694-4.566 4.943.359.31.678.924.678 1.862 0 1.344-.012 2.427-.012 2.756 0 .269.18.58.688.482A10.02 10.02 0 0022 12.017C22 6.484 17.523 2 12 2z"
            clipRule="evenodd"
          />
        </svg>
      );
    case "dribbble":
      return (
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M12 2.001c-5.522 0-10 4.477-10 10 0 5.522 4.478 10 10 10 5.523 0 10-4.478 10-10 0-5.523-4.477-10-10-10zM9.601 17.901c-2.426-1.004-4.12-3.327-4.138-6.027.08.036.779.349 1.952.349 1.356 0 3.393-.349 5.366-1.348.148.296.29.588.422.875-.587.278-1.226.572-1.882.872.272.51.535 1.031.779 1.554 1.67-.748 3.197-1.713 4.323-2.811a7.4 7.4 0 011.034.608c-.109.126-1.288 1.464-3.298 2.794.2.451.38.895.547 1.329.065.172.13.343.191.512 2.545-1.283 4.161-3.418 4.652-5.526.157.644.242 1.317.242 2.014 0 1.43-.372 2.772-1.016 3.936-.417-.834-1.053-1.934-1.891-2.875-.033-.037-.065-.073-.098-.109.013-.014.026-.03.039-.044 1.038-1.127 1.715-2.292 1.962-3.447.313.49.588 1.007.82 1.549-.303.115-1.218.448-3.004 1.337-.035-.083-.072-.164-.107-.246-.191-.442-.393-.885-.604-1.325.063-.023.127-.048.19-.07 2.082-.78 3.628-1.685 4.576-2.548.052.52.079 1.052.079 1.591 0 1.692-.564 3.348-1.626 4.756a9.13 9.13 0 00-1.128-1.07c.63-.73 1.085-1.596 1.341-2.538-.526-.249-1.324-.544-2.428-.709-1.553-.23-2.75.03-3.712.756a8.732 8.732 0 00-.307-.426c-.345-.482-.67-.98-.975-1.493-.35.103-.706.194-1.071.277-.184-.403-.37-.806-.56-1.207a11.72 11.72 0 01-1.004 1.48c-.274-.449-.53-.909-.774-1.373a12.07 12.07 0 001.2-1.696A7.987 7.987 0 0112 4.001c2.05 0 3.935.756 5.403 2.014-1.77.824-4.432 1.607-6.64 1.641-1.563-.008-2.805-.288-3.695-.792A8.011 8.011 0 014 12c0 1.063.21 2.077.585 2.996.305-.215.968-.665 1.932-1.008.137.278.274.556.414.834-1.242.47-2.161 1.002-2.575 1.285.504.92 1.215 1.708 2.052 2.297zm9.126-10.15c.027.014.054.03.08.045-.96 1.014-2.442 1.859-4.31 2.548-.045-.082-.093-.166-.14-.248-.168-.302-.341-.6-.521-.894 1.743-.236 3.718-.759 4.891-1.45zm-5.688.67c-.274-.478-.552-.952-.835-1.42 2.366-.446 4.189-1.208 5.247-1.873.557.92.964 1.949 1.18 3.055-.77.667-2.368 1.456-4.52 1.86a9.99 9.99 0 01-.541-1.622 10.28 10.28 0 01-.531-.978z"
            clipRule="evenodd"
          />
        </svg>
      );
    default:
      return null;
  }
}
