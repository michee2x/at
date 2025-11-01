import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function HoverCardInfo() {
  return (
    <div className="flex justify-between gap-4">
      <Avatar>
        <AvatarImage
          src="https://github.com/evilrabbit.png"
          alt="@evilrabbit"
        />
        <AvatarFallback>VC</AvatarFallback>
      </Avatar>
      <div className="space-y-1">
        <h4 className="text-sm font-semibold">@evilrabbit</h4>
        <p className="text-sm">
          The React Framework – created and maintained by @vercel.
        </p>
        <div className="text-muted-foreground text-xs">
          Joined December 2021
        </div>
      </div>
    </div>
  );
}
