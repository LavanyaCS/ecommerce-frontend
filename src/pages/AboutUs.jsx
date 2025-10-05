import React from "react";

function AboutUs() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <header className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">About Liyara</h1>
        <p className="text-gray-700 text-lg">
          Discover the story behind our brand and what drives us.
        </p>
      </header>

      {/* Our Story */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">Our Story</h2>
        <p className="text-gray-600 leading-relaxed">
          Liyara was born from a passion for creating meaningful connections between
          people and products. Our goal is to bring innovation, quality, and
          sustainability together in everything we do. From humble beginnings, we
          have grown into a brand trusted by thousands of customers worldwide.
        </p>
      </section>

      {/* Mission */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">Our Mission</h2>
        <p className="text-gray-600 leading-relaxed">
          At Liyara, our mission is to deliver high-quality, innovative products
          that make life easier and more enjoyable. We strive to exceed customer
          expectations and build lasting relationships based on trust and
          transparency.
        </p>
      </section>

      {/* Vision */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">Our Vision</h2>
        <p className="text-gray-600 leading-relaxed">
          We envision a world where quality, innovation, and sustainability
          coexist seamlessly. Liyara aims to set new standards in our industry,
          inspiring others to follow a path of creativity, integrity, and social
          responsibility.
        </p>
      </section>

      {/* CTA */}
      <section className="text-center">
        <p className="text-gray-700 mb-4">
          Join us on our journey and discover what makes Liyara unique.
        </p>
        <button className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900">
          Explore Products
        </button>
      </section>
    </div>
  );
}

export default AboutUs;
