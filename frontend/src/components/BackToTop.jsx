import { useEffect, useState } from "react";

function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > 350);
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  return (
    <button
      className={visible ? "back-to-top show" : "back-to-top"}
      onClick={scrollToTop}
      title="Voltar ao topo"
    >
      ↑
    </button>
  );
}

export default BackToTop;