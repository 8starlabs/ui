import HomepageDemoCard from "./homepage-demo-card";
import ShakeCardDemo from "./shake-card-demo";

const ShakeCard = () => {
  return (
    <HomepageDemoCard
      href="/docs/components/shake"
      title="Shake"
      description={
        <p className="text-sm text-muted-foreground">
          Stripe-style perspective error shake for form fields, with a
          declarative wrapper and an imperative hook.
        </p>
      }
      demo={<ShakeCardDemo />}
    />
  );
};

export default ShakeCard;
