import Image from "next/image";

export default function Footer() {
  return (
    <footer className="foot" data-reveal="fade-up">
      <span>
        <Image
          src="/images/logo-n.svg"
          alt=""
          aria-hidden="true"
          width={28}
          height={28}
          className="foot-mark"
        />
        © NORSTA HOME
      </span>
      <span>مهندس افسانه مردانی</span>
      <span>ایران · ترکیه</span>
    </footer>
  );
}
