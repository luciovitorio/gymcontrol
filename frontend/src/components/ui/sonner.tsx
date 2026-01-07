import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="system"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg data-[type=error]:!bg-destructive data-[type=error]:!text-destructive-foreground data-[type=error]:!border-destructive data-[type=success]:!bg-green-500 data-[type=success]:!text-white data-[type=success]:!border-green-600 data-[type=warning]:!bg-yellow-500 data-[type=warning]:!text-white data-[type=warning]:!border-yellow-600 data-[type=info]:!bg-blue-500 data-[type=info]:!text-white data-[type=info]:!border-blue-600",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
