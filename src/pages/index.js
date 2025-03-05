import React from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./styles.module.css";
import AlgoliaSearchBox from "@theme/SearchBar";

const features = [
  {
    title: "Get started",
    imageUrl: "img/home-get-started.png",
    url: "/docs/guides",
    description:
      "New to Camunda 8? Create an account and start modeling your first process.",
  },
  {
    title: "Components",
    imageUrl: "img/home-components.png",
    url: "/docs/components/",
    description:
      "Explore components such as Console, Modeler, Zeebe, Operate, and Optimize.",
  },
  {
    title: "Self-Managed",
    imageUrl: "img/home-self-managed.png",
    url: "/docs/self-managed/about-self-managed/",
    description:
      "Set up and host Camunda 8 yourself instead of using Camunda 8 SaaS.",
  },
  {
    title: "APIs and tools",
    imageUrl: "img/home-apis.png",
    url: "/docs/apis-tools/working-with-apis-tools/",
    description:
      "Explore Zeebe client libraries, Camunda component APIs, and SDKs.",
  },
  {
    title: "Best Practices",
    imageUrl: "img/home-bp.png",
    url: "/docs/components/best-practices/best-practices-overview/",
    description:
      "Level up your BPMN and DMN skills, including insights from consulting and the community.",
  },
  {
    title: "General reference",
    imageUrl: "img/home-reference.png",
    url: "/docs/reference/",
    description:
      "Release notes, announcements, supported environments, licenses, and more.",
  },
];

function Feature({ imageUrl, url, title, description }) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div
      className={clsx(
        "col component-block",
        styles.features,
        styles.featuresSection
      )}
    >
      <Link
        to={useBaseUrl(url)}
        title={title}
        className={clsx(styles.featuresLink)}
      >
        {imgUrl && (
          <div className="text--center">
            <img className={styles.featuresImage} src={imgUrl} alt={title} />
          </div>
        )}
        <h3 className={clsx("text--center", styles.featuresTitle)}>{title}</h3>
        <p className={clsx("text--center", styles.featuresDescription)}>
          {description}
        </p>
      </Link>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Start orchestrating your processes with Camunda 8 SaaS or Self-Managed."
    >
      <header className={clsx("hero hero--primary", styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className="homeSearch">
            <AlgoliaSearchBox />
          </div>
          <div className={clsx("row", styles.buttonsWrapper)}>
            <div className={clsx("", styles.buttons)}>
              <Link
                className={clsx(
                  "button button--outline button--secondary button--lg button--hero get-started",
                  styles.getStarted
                )}
                to={useBaseUrl("docs/guides/")}
                title="Get started with Camunda 8"
              >
                Get started
              </Link>
            </div>
            <div className={clsx("", styles.buttons)}>
              <Link
                className={clsx(
                  "button button--outline button--secondary button--lg sign-up",
                  styles.getStarted
                )}
                to={useBaseUrl(
                  "https://signup.camunda.com/accounts?utm_source=docs.camunda.io&utm_medium=referral"
                )}
                title="Sign up for Camunda 8 SaaS"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </header>
      <main>
        {features && features.length > 0 && (
          <section className={(styles.features, styles.featuresBlock)}>
            <div className="container">
              <div className={styles.featuresGrid}>
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
        <div className={clsx("hero hero--secondary", styles.heroBanner)}>
          <div className="container">
            <h2 className="hero__title">What's new</h2>
            <p className="hero__subtitle">
              Check out some of our latest features
            </p>
            <div className={styles.buttons}>
              <Link
                className={clsx(
                  "button button--outline button--secondary button--lg button--hero get-started-use-case",
                  styles.getStarted
                )}
                to={useBaseUrl(
                  "docs/apis-tools/spring-zeebe-sdk/getting-started/"
                )}
              >
                Spring Zeebe SDK
              </Link>
              <Link
                className={clsx(
                  "button button--outline button--secondary button--lg button--hero get-started-use-case get-started-use-case-2",
                  styles.getStarted
                )}
                to={useBaseUrl("docs/reference/release-notes/")}
              >
                Release notes
              </Link>
              <Link
                className={clsx(
                  "button button--outline button--secondary button--lg button--hero get-started-use-case get-started-use-case-2",
                  styles.getStarted
                )}
                to={useBaseUrl("docs/apis-tools/node-js-sdk/")}
              >
                Node.js SDK
              </Link>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}

export default Home;
