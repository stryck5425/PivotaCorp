import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface LegalMentionsProps extends React.HTMLAttributes<HTMLDivElement> {}

const LegalMentions: React.FC<LegalMentionsProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        "flex-1 overflow-y-auto p-4 lg:p-8 bg-background text-foreground prose dark:prose-invert mx-auto max-w-4xl",
        className
      )}
      {...props}
    >
      <h2 className="text-4xl font-extrabold text-center mb-6 text-primary">
        Mentions Légales de Pivota Corp™
      </h2>
      <p className="text-center text-lg text-muted-foreground mb-10">
        Bienvenue sur la page des Mentions Légales de Pivota Corp™. Contrairement à nos Conditions Générales, cette section est conçue pour être réellement compréhensible.
      </p>

      <div className="space-y-6">
        <p>
          Ce site web, "Pivota Corp™ Official Terms & Conditions", est une œuvre satirique et fictive. Il a été créé dans le but d'explorer et de parodier la complexité, l'absurdité et la longueur souvent démesurée des conditions générales d'utilisation que nous acceptons quotidiennement sans les lire.
        </p>
        <p>
          Toutes les clauses, les noms d'entreprise, les personnages et les situations décrits sur ce site sont purement imaginaires et ne doivent en aucun cas être pris au sérieux ou considérés comme des conseils juridiques ou commerciaux. Toute ressemblance avec des entreprises ou des situations existantes est fortuite et involontaire.
        </p>
        <p>
          L'objectif principal est de divertir et de sensibiliser de manière humoristique à l'importance (et parfois à l'impossibilité) de comprendre les documents légaux en ligne. Nous espérons que vous apprécierez cette expérience de lecture unique et que cela vous incitera à jeter un œil plus attentif aux "vraies" conditions générales à l'avenir.
        </p>
        <p>
          Ce site ne collecte aucune donnée personnelle réelle et n'a aucune intention commerciale. Il s'agit d'un projet de démonstration et d'exploration des technologies web modernes, notamment React, TypeScript et Tailwind CSS, dans un cadre ludique et éducatif.
        </p>
      </div>

      <div className="mt-12 text-center">
        <Link to="/">
          <Button variant="outline" className="text-primary-foreground bg-primary hover:bg-primary/90">
            Retour aux Conditions Générales
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default LegalMentions;