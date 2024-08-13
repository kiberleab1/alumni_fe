import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function useAOS(config = {}) {
  useEffect(() => {
    AOS.init(config);

    return () => {
      AOS.refresh();
    };
  }, [config]);
}
