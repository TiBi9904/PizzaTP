import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const halfPage = document.body.scrollHeight / 4;

      setVisible(scrollY > halfPage);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="
        fixed bottom-24 right-6
        w-12 h-12
        rounded-full
        bg-blue-600 text-white
        shadow-xl
        hover:bg-blue-800
        transition-all duration-300
        flex items-center justify-center
        z-[110]
      "
      title="Lên đầu trang"
    >
      <ArrowUp size={30} />
    </button>
  );
};

export default ScrollToTopButton;