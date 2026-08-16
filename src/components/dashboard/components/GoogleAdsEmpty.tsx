import { Card, CardContent } from "@/components/ui/card";

export function GoogleAdsEmpty() {
  return (
    <Card className="shadow-sm border-dashed border-2 p-12 text-center mt-8">
      <CardContent className="flex flex-col items-center">
        <div className="bg-slate-100 p-4 rounded-full mb-4">
          <span className="text-2xl">🔍</span>
        </div>
        <h3 className="text-xl font-bold mb-2">Google Ads ainda não conectado</h3>
        <p className="text-slate-600 max-w-sm mb-6">Os resultados das campanhas do Google serão exibidos aqui quando a integração estiver disponível.</p>
      </CardContent>
    </Card>
  );
}
