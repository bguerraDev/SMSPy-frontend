function Button({ children, variant = "primary", ...props }) {
  const base =
    "px-6 py-3 rounded-xl text-white transition-all duration-200 shadow-md";
  const variants = {
    primary:
      "bg-gradient-to-r from-pink-500 to-blue-500 font-bold hover:scale-105",
    secondary:
      "bg-[#181826] border border-blue-500 font hover:bg-blue-600 hover:text-white",
  };

  return (
    <button className={`${base} ${variants[variant]}`} {...props}>
      {children}
    </button>
  );
}

export default Button;