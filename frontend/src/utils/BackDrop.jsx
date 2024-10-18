const BackdropSidebar = ({ onClick }) => (
  <div
    className="fixed inset-0 bg-black opacity-50 z-10 lg:hidden"
    onClick={onClick}></div>
);

const BackdropAvatar = ({ onClick }) => (
  <div
    className="fixed inset-0 bg-black opacity-50 sm:opacity-0 z-10 "
    onClick={onClick}></div>
);

export { BackdropAvatar, BackdropSidebar };
