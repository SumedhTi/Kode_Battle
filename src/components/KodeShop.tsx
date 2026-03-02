import { useState } from "react";
import { mockShopItems, mockUser } from "@/data/mockData";
import { Coins, CheckCircle2, ShoppingBag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function KodeShop() {
  const { toast } = useToast();
  const [balance, setBalance] = useState(mockUser.battleCoins);

  const handleRedeem = (item: typeof mockShopItems[0]) => {
    if (balance < item.price) {
      toast({ title: "Insufficient Coins", description: `You need ${item.price - balance} more Battle Coins.`, variant: "destructive" });
      return;
    }
    setBalance((b) => b - item.price);
    toast({
      title: "🎉 Redeemed Successfully!",
      description: `You got "${item.title}"! Check your email for details.`,
    });
  };

  return (
    <div className="animate-slide-up space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Kode-Shop</h1>
          <p className="mt-1 text-muted-foreground">Spend your hard-earned Battle Coins on epic rewards</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-neon-amber/30 bg-neon-amber/10 px-5 py-3">
          <Coins className="h-5 w-5 text-neon-amber" />
          <span className="font-display text-xl font-bold text-neon-amber">{balance.toLocaleString()}</span>
          <span className="text-sm text-neon-amber/70">coins</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockShopItems.map((item) => {
          const canAfford = balance >= item.price;
          return (
            <div
              key={item.id}
              className="group flex flex-col justify-between rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30"
            >
              <div>
                <div className="mb-3 text-4xl">{item.image}</div>
                <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  {item.category}
                </span>
                <h3 className="mt-2 text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Coins className="h-4 w-4 text-neon-amber" />
                  <span className="font-mono text-lg font-bold text-neon-amber">{item.price.toLocaleString()}</span>
                </div>
                <button
                  onClick={() => handleRedeem(item)}
                  disabled={!canAfford}
                  className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    canAfford
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 glow-blue"
                      : "cursor-not-allowed bg-muted text-muted-foreground"
                  }`}
                >
                  <ShoppingBag className="h-4 w-4" />
                  Redeem
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
