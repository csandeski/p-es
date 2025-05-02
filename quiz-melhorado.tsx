"use client"

import { useState, useEffect } from "react"
import confetti from "canvas-confetti"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Trophy,
  Star,
  CroissantIcon as Bread,
  Award,
  BookOpen,
  Gift,
  Clock,
  Wheat,
  Flame,
  ShoppingCart,
  Lock,
  AlertCircle,
  Unlock,
  Timer,
  Users,
  Sparkles,
  Cake,
  Pizza,
  Utensils,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Adicionar estilo de animação de pulsação
const pulseAnimation = {
  "@keyframes pulse": {
    "0%": { transform: "scale(1)" },
    "50%": { transform: "scale(1.05)" },
    "100%": { transform: "scale(1)" },
  },
  animation: "pulse 2s infinite",
}

export default function BreadQuiz() {
  const [xp, setXp] = useState(0)
  const [currentLevel, setCurrentLevel] = useState(1)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState("")
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [unlockedRecipes, setUnlockedRecipes] = useState([])
  const [activeTab, setActiveTab] = useState("quiz")
  const [timeLeft, setTimeLeft] = useState(20 * 60) // 20 minutos em segundos
  const [timerActive, setTimerActive] = useState(false)
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)
  const [purchaseLoading, setPurchaseLoading] = useState(false)
  const [purchaseSuccess, setPurchaseSuccess] = useState(false)

  const levels = [
    { level: 1, name: "Aprendiz de Padeiro", xp: 0 },
    { level: 2, name: "Ajudante de Forno", xp: 30 },
    { level: 3, name: "Mestre das Massas", xp: 70 },
    { level: 4, name: "Padeiro Artesão", xp: 110 },
    { level: 5, name: "Mestre Padeiro", xp: 220 },
  ]

  const questions = [
    {
      question: "Qual fermento é o ideal para fazer um pão que cresce bastante e fica super fofo?",
      image: "https://i.imgur.com/tXRDnQ9.png",
      options: [
        { text: "Fermento químico", icon: "flask" },
        { text: "Fermento biológico fresco", icon: "bread" },
        { text: "Fermento seco instantâneo", icon: "box" },
      ],
      correct: "Fermento biológico fresco",
      feedbackCorrect:
        "Excelente escolha! O fermento biológico fresco dá volume e leveza ao pão. Ele contém mais umidade e células de levedura ativas que ajudam na fermentação.",
      feedbackIncorrect:
        "Hmm... esse fermento não é o ideal. O fermento biológico fresco contém mais umidade e células de levedura ativas que ajudam na fermentação perfeita.",
      explanation:
        "O fermento biológico fresco contém mais células de levedura ativas e umidade, o que resulta em uma fermentação mais vigorosa e um pão mais fofo. Ele é ideal para massas que precisam de bastante crescimento.",
      bonus: "Truque do fermento para seu pão crescer muito!",
    },
    {
      question: "Qual é a temperatura ideal para assar um pão de forma?",
      image: "https://i.imgur.com/4lF42re.png",
      options: [
        { text: "160°C", icon: "thermometer" },
        { text: "180°C", icon: "thermometer" },
        { text: "200°C", icon: "flame" },
      ],
      correct: "200°C",
      feedbackCorrect:
        "Perfeito! 200°C garante uma crosta dourada e um miolo macio. Esta temperatura permite que o pão cresça rapidamente no início e depois desenvolva uma crosta bonita.",
      feedbackIncorrect:
        "A temperatura ideal é 200°C. Esta temperatura permite que o pão cresça rapidamente no início e depois desenvolva uma crosta bonita.",
      explanation:
        "A temperatura de 200°C é ideal para pães de forma porque permite um crescimento inicial rápido (oven spring) e depois forma uma crosta dourada enquanto mantém o miolo úmido e macio.",
      bonus: "Técnica da temperatura correta!",
    },
    {
      question: "Qual é o ingrediente que dá o sabor característico ao pão?",
      image: "/placeholder.svg?height=200&width=300",
      options: [
        { text: "Açúcar", icon: "candy" },
        { text: "Sal", icon: "wheat" },
        { text: "Fermento", icon: "bread" },
      ],
      correct: "Sal",
      feedbackCorrect:
        "Isso mesmo! O sal equilibra e realça o sabor do pão. Além disso, ele controla a ação do fermento e fortalece o glúten.",
      feedbackIncorrect:
        "O sal é o segredo do sabor. Ele não apenas dá sabor, mas também controla a ação do fermento e fortalece o glúten.",
      explanation:
        "O sal é essencial para o sabor do pão, mas também tem funções técnicas: controla a velocidade da fermentação, fortalece a rede de glúten e ajuda na conservação do pão.",
      bonus: "A temperagem perfeita para Pães Caseiros!",
    },
    {
      question: "Qual é a melhor farinha para fazer pães artesanais com boa estrutura?",
      image: "/placeholder.svg?height=200&width=300",
      options: [
        { text: "Farinha de trigo comum", icon: "wheat" },
        { text: "Farinha de trigo integral", icon: "wheat" },
        { text: "Farinha de trigo tipo 1", icon: "wheat" },
      ],
      correct: "Farinha de trigo tipo 1",
      feedbackCorrect:
        "Excelente! A farinha de trigo tipo 1 tem maior teor de proteínas, o que forma mais glúten e dá melhor estrutura ao pão.",
      feedbackIncorrect:
        "Na verdade, a farinha de trigo tipo 1 é a ideal. Ela tem maior teor de proteínas, formando mais glúten e melhor estrutura.",
      explanation:
        "A farinha tipo 1 possui entre 11-13% de proteína, o que resulta em uma rede de glúten mais forte, ideal para pães artesanais que precisam de boa estrutura e crescimento.",
      bonus: "Guia completo sobre tipos de farinha para pães!",
    },
    {
      question: "O que é a autólise na produção de pães?",
      image: "/placeholder.svg?height=200&width=300",
      options: [
        { text: "Fermentação acelerada da massa", icon: "clock" },
        { text: "Mistura inicial de farinha e água", icon: "droplet" },
        { text: "Descanso da massa após a primeira sova", icon: "hourglass" },
      ],
      correct: "Mistura inicial de farinha e água",
      feedbackCorrect:
        "Correto! A autólise é a mistura de farinha e água que descansa antes de adicionar os outros ingredientes. Isso melhora a hidratação e desenvolvimento do glúten.",
      feedbackIncorrect:
        "A autólise é a mistura inicial de farinha e água que descansa antes de adicionar os outros ingredientes, melhorando a hidratação e desenvolvimento do glúten.",
      explanation:
        "Na autólise, a farinha e água são misturadas e deixadas em repouso por 20-60 minutos. Isso permite que as enzimas naturais da farinha iniciem a quebra do amido e desenvolvimento do glúten sem esforço mecânico.",
      bonus: "Técnica de autólise para pães profissionais!",
    },
    {
      question: "Qual destas técnicas melhora a crosta crocante do pão?",
      image: "/placeholder.svg?height=200&width=300",
      options: [
        { text: "Borrifar água no forno durante o cozimento", icon: "droplet" },
        { text: "Adicionar mais açúcar à massa", icon: "candy" },
        { text: "Reduzir a temperatura do forno", icon: "thermometer" },
      ],
      correct: "Borrifar água no forno durante o cozimento",
      feedbackCorrect:
        "Perfeito! O vapor criado pela água borrifada ajuda a manter a superfície do pão flexível por mais tempo, permitindo maior expansão e depois formando uma crosta crocante.",
      feedbackIncorrect:
        "Borrifar água no forno cria vapor que mantém a superfície do pão flexível por mais tempo, permitindo maior expansão e depois formando uma crosta crocante.",
      explanation:
        "O vapor no forno impede que a superfície do pão endureça muito rápido, permitindo que o pão cresça mais. Quando o vapor se dissipa, a superfície desidrata e forma uma crosta crocante e dourada.",
      bonus: "Segredo da crosta crocante revelado!",
    },
    {
      question: "Qual é o propósito da dobra (fold) da massa durante a fermentação?",
      image: "/placeholder.svg?height=200&width=300",
      options: [
        { text: "Remover o excesso de ar da massa", icon: "hand" },
        { text: "Fortalecer a rede de glúten", icon: "scissors" },
        { text: "Reduzir o tempo de fermentação", icon: "clock" },
      ],
      correct: "Fortalecer a rede de glúten",
      feedbackCorrect:
        "Correto! As dobras durante a fermentação realinham as cadeias de glúten, fortalecendo a estrutura da massa sem expulsar todo o gás produzido pelo fermento.",
      feedbackIncorrect:
        "As dobras servem para fortalecer a rede de glúten, realinhando as cadeias proteicas e criando uma estrutura mais forte sem expulsar todo o gás da fermentação.",
      explanation:
        "As dobras são uma técnica de desenvolvimento da massa que alinha as cadeias de glúten sem desgaseificar completamente. Isso dá força à massa enquanto mantém parte das bolhas de ar criadas durante a fermentação.",
      bonus: "Técnica profissional de dobras para massas de alta hidratação!",
    },
    {
      question: "O que é o 'oven spring' na panificação?",
      image: "/placeholder.svg?height=200&width=300",
      options: [
        { text: "Uma mola especial no forno para pães", icon: "scissors" },
        { text: "O crescimento rápido do pão nos primeiros minutos no forno", icon: "bread" },
        { text: "Um tipo de forno profissional para pães", icon: "flame" },
      ],
      correct: "O crescimento rápido do pão nos primeiros minutos no forno",
      feedbackCorrect:
        "Exato! O 'oven spring' é a expansão final e vigorosa que ocorre nos primeiros 10-15 minutos de cozimento, devido ao calor que ativa o fermento e expande os gases.",
      feedbackIncorrect:
        "O 'oven spring' refere-se ao crescimento rápido do pão nos primeiros 10-15 minutos no forno, causado pelo calor que ativa o fermento e expande os gases da massa.",
      explanation:
        "Quando o pão entra no forno quente, o calor causa uma última atividade fermentativa intensa, expandindo os gases já presentes na massa. Esta expansão final, chamada 'oven spring', ocorre antes da estrutura do pão fixar-se pelo calor.",
      bonus: "Como maximizar o 'oven spring' para pães mais altos e leves!",
    },
    {
      question: "Qual a função do ácido ascórbico (vitamina C) na panificação industrial?",
      image: "/placeholder.svg?height=200&width=300",
      options: [
        { text: "Conservar o pão por mais tempo", icon: "clock" },
        { text: "Fortalecer a rede de glúten", icon: "scissors" },
        { text: "Dar cor à crosta do pão", icon: "flame" },
      ],
      correct: "Fortalecer a rede de glúten",
      feedbackCorrect:
        "Correto! O ácido ascórbico atua como um melhorador de farinha, fortalecendo a rede de glúten e permitindo maior retenção de gás na massa.",
      feedbackIncorrect:
        "O ácido ascórbico (vitamina C) é usado como melhorador de farinha, fortalecendo a rede de glúten e permitindo maior retenção de gás na massa.",
      explanation:
        "Na panificação industrial, o ácido ascórbico é um oxidante que fortalece o glúten, ajudando a massa a reter gases, aumentando o volume do pão e proporcionando uma textura mais uniforme ao miolo.",
      bonus: "Melhoradores naturais para substituir aditivos industriais!",
    },
    {
      question: "Qual técnica tradicional usa uma cultura fermentada natural em vez de fermento comercial?",
      image: "/placeholder.svg?height=200&width=300",
      options: [
        { text: "Fermentação direta", icon: "clock" },
        { text: "Poolish", icon: "droplet" },
        { text: "Sourdough (Levain)", icon: "bread" },
      ],
      correct: "Sourdough (Levain)",
      feedbackCorrect:
        "Correto! O sourdough ou levain é uma cultura fermentada natural que contém bactérias láticas e leveduras selvagens que fermentam a massa naturalmente.",
      feedbackIncorrect:
        "A técnica que usa cultura fermentada natural é o sourdough (ou levain), que contém bactérias láticas e leveduras selvagens coletadas do ambiente.",
      explanation:
        "O sourdough é uma massa fermentada que contém leveduras selvagens e bactérias láticas que ocorrem naturalmente. Essa cultura viva é mantida com alimentações regulares de farinha e água, e usada para fermentar pães com sabor mais complexo e maior durabilidade natural.",
      bonus: "Como criar e manter seu próprio fermento natural em casa!",
    },
    {
      question: "Qual é o propósito da 'estufa' ou 'câmara de fermentação' na produção de pães?",
      image: "/placeholder.svg?height=200&width=300",
      options: [
        { text: "Resfriar a massa rapidamente após a sova", icon: "thermometer" },
        { text: "Criar ambiente ideal de temperatura e umidade para fermentação", icon: "droplet" },
        { text: "Secar a superfície do pão antes do cozimento", icon: "flame" },
      ],
      correct: "Criar ambiente ideal de temperatura e umidade para fermentação",
      feedbackCorrect:
        "Exatamente! A estufa mantém um ambiente controlado com temperatura e umidade ideais para que o fermento trabalhe de forma consistente e eficiente.",
      feedbackIncorrect:
        "A estufa ou câmara de fermentação tem como objetivo criar e manter um ambiente controlado com temperatura e umidade ideais para a fermentação do pão.",
      explanation:
        "A câmara de fermentação controla a temperatura (geralmente entre 24-28°C) e a umidade (70-85%), criando condições ideais para a atividade do fermento. Isso permite fermentações mais previsíveis e consistentes, independente das condições do ambiente externo.",
      bonus: "Como criar uma câmara de fermentação caseira com itens simples!",
    },
    {
      question: "O que é o 'ponto de véu' na massa do pão?",
      image: "/placeholder.svg?height=200&width=300",
      options: [
        { text: "Quando a massa forma uma película translúcida quando esticada", icon: "scissors" },
        { text: "O momento em que se adiciona a farinha de cobertura", icon: "wheat" },
        { text: "O ponto onde a crosta começa a se formar no forno", icon: "flame" },
      ],
      correct: "Quando a massa forma uma película translúcida quando esticada",
      feedbackCorrect:
        "Correto! O ponto de véu é atingido quando o glúten está bem desenvolvido, permitindo esticar a massa até formar uma película fina e translúcida sem romper.",
      feedbackIncorrect:
        "O ponto de véu é quando você consegue esticar a massa até formar uma película fina e translúcida sem romper, indicando que o glúten está bem desenvolvido.",
      explanation:
        "O 'ponto de véu' ou 'teste da janela' é uma técnica para verificar se o glúten da massa está adequadamente desenvolvido. Ao esticar um pedaço da massa, ela deve formar uma membrana fina translúcida sem rasgar, indicando que está pronta para fermentar.",
      bonus: "Como identificar o ponto perfeito da massa em cada tipo de pão!",
    },
    {
      question: "O que causa o 'choque térmico' benéfico para alguns tipos de pão?",
      image: "/placeholder.svg?height=200&width=300",
      options: [
        { text: "Colocar a massa quente na geladeira após a sova", icon: "thermometer" },
        { text: "Jogar água gelada na massa durante a mistura", icon: "droplet" },
        { text: "Transferir o pão diretamente do forno quente para um ambiente frio", icon: "flame" },
      ],
      correct: "Transferir o pão diretamente do forno quente para um ambiente frio",
      feedbackCorrect:
        "Correto! O choque térmico ao sair do forno ajuda a crosta a 'estalar', criando aquela textura crocante que muitos pães artesanais têm.",
      feedbackIncorrect:
        "O choque térmico benéfico ocorre ao transferir o pão do forno quente para um ambiente mais frio, fazendo a crosta 'estalar' e desenvolver aquela textura crocante característica.",
      explanation:
        "O choque térmico ocorre quando o pão sai do forno muito quente para um ambiente mais frio. Isso faz com que a crosta contraia rapidamente, criando pequenas rachaduras que contribuem para a crocância e aparência rústica do pão artesanal.",
      bonus: "Técnicas de resfriamento para diferentes tipos de pães!",
    },
    {
      question:
        "Qual ingrediente pode ser usado para aumentar a durabilidade natural do pão sem conservantes químicos?",
      image: "/placeholder.svg?height=200&width=300",
      options: [
        { text: "Batata cozida amassada", icon: "wheat" },
        { text: "Açúcar refinado", icon: "candy" },
        { text: "Bicarbonato de sódio", icon: "flask" },
      ],
      correct: "Batata cozida amassada",
      feedbackCorrect:
        "Exato! A batata cozida amassada adiciona umidade e amido à massa, que retém água por mais tempo e retarda o envelhecimento do pão.",
      feedbackIncorrect:
        "A batata cozida amassada é excelente para aumentar a vida útil do pão. Ela adiciona umidade e amido que retém água por mais tempo, retardando o envelhecimento.",
      explanation:
        "A batata contém amidos que retêm umidade melhor que a farinha de trigo, mantendo o pão macio por mais tempo. Além disso, o amido da batata retarda a retrogradação do amido do trigo, que é o processo que torna o pão duro e velho.",
      bonus: "Ingredientes naturais que prolongam a maciez do pão por dias!",
    },
    {
      question: "Qual é a função do 'poolish' na produção de pães?",
      image: "/placeholder.svg?height=200&width=300",
      options: [
        { text: "Dar cor à crosta do pão", icon: "flame" },
        { text: "Desenvolver sabor e melhorar a textura", icon: "bread" },
        { text: "Reduzir o tempo total de preparo", icon: "clock" },
      ],
      correct: "Desenvolver sabor e melhorar a textura",
      feedbackCorrect:
        "Correto! O poolish é uma pré-fermentação líquida que desenvolve compostos aromáticos complexos e enzimas que melhoram o sabor e a textura final do pão.",
      feedbackIncorrect:
        "O poolish é uma pré-fermentação líquida usada para desenvolver sabor mais complexo e melhorar a textura do pão final, criando um miolo mais aberto e aerado.",
      explanation:
        "O poolish é uma pré-fermentação líquida (geralmente 100% de hidratação) que fermenta por várias horas antes de ser incorporada à massa final. Durante esse tempo, desenvolve ácidos orgânicos, álcoois e ésteres que contribuem para sabor complexo, além de enzimas que melhoram a extensibilidade da massa.",
      bonus: "Receita completa de poolish para pães com sabor profissional!",
    },
    {
      question: "Por que alguns pães precisam de duas fermentações (primeira e segunda)?",
      image: "/placeholder.svg?height=200&width=300",
      options: [
        { text: "Para economizar fermento", icon: "wheat" },
        { text: "Para desenvolver sabor e estrutura", icon: "bread" },
        { text: "Apenas por tradição antiga", icon: "hourglass" },
      ],
      correct: "Para desenvolver sabor e estrutura",
      feedbackCorrect:
        "Exato! A primeira fermentação (bulk) desenvolve sabor e força no glúten, enquanto a segunda (após moldar) permite a formação correta da estrutura final do pão.",
      feedbackIncorrect:
        "As duas fermentações são importantes para desenvolver sabor (na primeira) e estrutura final do pão (na segunda, após moldar).",
      explanation:
        "A primeira fermentação (em massa) permite o desenvolvimento de sabor e fortalecimento do glúten. Após a modelagem, a segunda fermentação permite que o pão recupere o volume e desenvolva a estrutura celular correta antes de ir ao forno. Este processo em duas etapas resulta em pães com melhor textura e sabor.",
      bonus: "Guia definitivo dos tempos de fermentação para cada tipo de pão!",
    },
    {
      question: "Qual é a técnica correta para esfriar um pão depois de assado?",
      image: "/placeholder.svg?height=200&width=300",
      options: [
        { text: "Cobrir com um pano úmido imediatamente", icon: "droplet" },
        { text: "Deixar esfriar completamente sobre uma grade", icon: "thermometer" },
        { text: "Colocar na geladeira por 30 minutos", icon: "flame" },
      ],
      correct: "Deixar esfriar completamente sobre uma grade",
      feedbackCorrect:
        "Correto! Esfriar sobre uma grade permite que o ar circule por todos os lados do pão, evitando que a umidade condense na base e torne a crosta mole.",
      feedbackIncorrect:
        "O pão deve esfriar completamente sobre uma grade, permitindo que o ar circule por todos os lados, evitando condensação de umidade que amoleceria a crosta.",
      explanation:
        "Esfriar o pão em uma grade permite que o vapor escape uniformemente por todos os lados. Se o pão for colocado em uma superfície plana enquanto quente, o vapor se condensa na parte inferior, amolecendo a crosta. Cobrir pão quente também causa condensação que arruína a crocância da crosta.",
      bonus: "Técnica perfeita de resfriamento para manter a crosta crocante!",
    },
    {
      question: "O que é o 'scoring' na panificação artesanal?",
      image: "/placeholder.svg?height=200&width=300",
      options: [
        { text: "Avaliar a qualidade do pão após assado", icon: "star" },
        { text: "Fazer cortes na superfície da massa antes de assar", icon: "scissors" },
        { text: "Polvilhar farinha na superfície para decoração", icon: "wheat" },
      ],
      correct: "Fazer cortes na superfície da massa antes de assar",
      feedbackCorrect:
        "Exato! O 'scoring' são os cortes feitos na superfície da massa antes de assar, que controlam onde o pão vai expandir durante o 'oven spring'.",
      feedbackIncorrect:
        "O 'scoring' consiste em fazer cortes na superfície da massa antes de assar, o que direciona e controla a expansão do pão durante o cozimento.",
      explanation:
        "O 'scoring' ou corte da massa é uma técnica que tem função tanto estética quanto técnica. Os cortes permitem que o pão expanda de forma controlada durante o 'oven spring', prevenindo rachaduras aleatórias e criando a aparência característica de muitos pães artesanais.",
      bonus: "Padrões de corte para criar pães artesanais deslumbrantes!",
    },
    {
      question: "Qual é o benefício de usar água filtrada para fazer pães?",
      image: "/placeholder.svg?height=200&width=300",
      options: [
        { text: "Reduz o tempo de cozimento", icon: "clock" },
        { text: "Melhora a atividade do fermento", icon: "bread" },
        { text: "Aumenta o teor de proteínas da massa", icon: "wheat" },
      ],
      correct: "Melhora a atividade do fermento",
      feedbackCorrect:
        "Correto! A água filtrada sem cloro permite que o fermento trabalhe melhor, pois o cloro pode inibir a atividade das leveduras.",
      feedbackIncorrect:
        "A água filtrada melhora a atividade do fermento porque não contém cloro ou outros componentes que possam inibir o crescimento das leveduras.",
      explanation:
        "O cloro presente na água da torneira é adicionado para matar microrganismos, mas pode também afetar negativamente as leveduras do fermento. Usar água filtrada ou deixar a água descansar para o cloro evaporar garante melhor fermentação e, consequentemente, melhor crescimento do pão.",
      bonus: "Guia completo sobre a influência da água na qualidade do pão!",
    },
    {
      question: "Qual técnica ajuda a criar um miolo mais aberto com bolhas grandes em pães artesanais?",
      image: "/placeholder.svg?height=200&width=300",
      options: [
        { text: "Sovar intensamente por 20 minutos", icon: "hand" },
        { text: "Alta hidratação e manuseio delicado", icon: "droplet" },
        { text: "Adicionar mais fermento à massa", icon: "bread" },
      ],
      correct: "Alta hidratação e manuseio delicado",
      feedbackCorrect:
        "Perfeito! Massas com alta hidratação (mais água) e manipuladas gentilmente preservam as bolhas de ar já formadas, resultando em um miolo mais aberto.",
      feedbackIncorrect:
        "Para criar um miolo aberto com bolhas grandes, a técnica ideal é usar alta hidratação (mais água na massa) e manusear a massa delicadamente para preservar as bolhas de ar.",
      explanation:
        "Massas com alta hidratação (acima de 70%) têm mais espaço para as bolhas de gás se desenvolverem. Combinado com um manuseio delicado que preserva essas bolhas, em vez de expulsá-las como na sova intensiva, o resultado é um pão com estrutura alveolar aberta e irregular, característica de pães artesanais.",
      bonus: "Técnicas avançadas para criar pães com alveolagem perfeita!",
    },
  ]

  const bonusItems = [
    {
      title: "Truque do fermento para seu pão crescer muito!",
      description: "Descubra como ativar o fermento corretamente para obter o máximo de crescimento em seus pães.",
      icon: "sparkles",
    },
    {
      title: "Técnica da temperatura correta!",
      description: "Aprenda a controlar a temperatura do forno para obter pães perfeitos em qualquer situação.",
      icon: "flame",
    },
    {
      title: "A temperagem perfeita para Pães Caseiros!",
      description: "Domine a arte de equilibrar os ingredientes para obter a textura ideal em seus pães.",
      icon: "star",
    },
    {
      title: "Farinhas Especiais para Pães Caseiros!",
      description: "Conheça os tipos de farinha ideais para cada tipo de pão e como combiná-las.",
      icon: "wheat",
    },
    {
      title: "Técnica de autólise para pães profissionais!",
      description: "Aprenda a técnica usada por padeiros profissionais para desenvolver o glúten naturalmente.",
      icon: "clock",
    },
    {
      title: "Segredo da crosta crocante revelado!",
      description: "Descubra como obter aquela crosta dourada e crocante que estala ao ser cortada.",
      icon: "sparkles",
    },
  ]

  const recipeCollections = [
    {
      id: 1,
      title: "300 Receitas de Pães Caseiros Fofinhos que Crescem Muito",
      description: "A coleção completa com todas as técnicas e segredos para pães perfeitos",
      image: "/placeholder.svg?height=200&width=300",
      price: 37.0,
      icon: "bread",
    },
    {
      id: 2,
      title: "75 Receitas de Tortas Salgadas",
      description: "Tortas salgadas perfeitas para qualquer ocasião",
      image: "/placeholder.svg?height=200&width=300",
      originalPrice: 19.9,
      price: 0,
      icon: "utensils",
      requiredCorrect: 1, // Reduzido de 2 para 1
    },
    {
      id: 3,
      title: "80 Receitas de Pizzas Artesanais",
      description: "Aprenda a fazer pizzas com massa perfeita e coberturas deliciosas",
      image: "/placeholder.svg?height=200&width=300",
      originalPrice: 19.9,
      price: 0,
      icon: "pizza",
      requiredCorrect: 2, // Reduzido de 4 para 2
    },
    {
      id: 4,
      title: "120 Receitas de Bolos, Doces e Sobremesas",
      description: "Doces irresistíveis para todas as ocasiões",
      image: "/placeholder.svg?height=200&width=300",
      originalPrice: 19.9,
      price: 0,
      icon: "cake",
      requiredCorrect: 3, // Reduzido de 6 para 3
    },
    {
      id: 5,
      title: "20 Receitas de Empadinhas e Empadões Artesanais",
      description: "Aprenda a fazer massas perfeitas e recheios suculentos",
      image: "/placeholder.svg?height=200&width=300",
      originalPrice: 19.9,
      price: 0,
      icon: "utensils",
      requiredCorrect: 4, // Reduzido de 8 para 4
    },
    {
      id: 6,
      title: "20 Receitas de Salgados Fritos Artesanais",
      description: "Salgados crocantes e suculentos para festas e eventos",
      image: "/placeholder.svg?height=200&width=300",
      originalPrice: 19.9,
      price: 0,
      icon: "utensils",
      requiredCorrect: 5, // Reduzido de 10 para 5
    },
    {
      id: 7,
      title: "110 Receitas de Salgados Assados",
      description: "Opções mais saudáveis e igualmente deliciosas de salgados",
      image: "/placeholder.svg?height=200&width=300",
      originalPrice: 19.9,
      price: 0,
      icon: "utensils",
      requiredCorrect: 7, // Reduzido de 12 para 7
    },
    {
      id: 8,
      title: "200 Receitas Práticas para AirFryer",
      description: "Receitas rápidas, saudáveis e deliciosas para sua fritadeira a ar",
      image: "/placeholder.svg?height=200&width=300",
      originalPrice: 19.9,
      price: 0,
      icon: "utensils",
      requiredCorrect: 9, // Reduzido de 14 para 9
    },
    {
      id: 9,
      title: "30 Receitas de Cucas Caseiras",
      description: "Cucas tradicionais com coberturas crocantes e massas macias",
      image: "/placeholder.svg?height=200&width=300",
      originalPrice: 19.9,
      price: 0,
      icon: "cake",
      requiredCorrect: 11, // Reduzido de 16 para 11
    },
    {
      id: 10,
      title: "Grupo VIP com Alunas e Chefs Profissionais",
      description: "Acesso exclusivo a grupo com dicas, suporte e novidades",
      image: "/placeholder.svg?height=200&width=300",
      originalPrice: 19.9,
      price: 0,
      icon: "users",
      requiredCorrect: 13, // Reduzido de 18 para 13
    },
  ]

  const tips = [
    {
      title: "Temperatura da Água",
      description:
        "Use água morna (não quente) para ativar o fermento adequadamente. A temperatura ideal é entre 35°C e 40°C.",
      icon: "thermometer",
    },
    {
      title: "Sova Adequada",
      description:
        "Sove a massa por pelo menos 10 minutos para desenvolver o glúten corretamente e garantir um pão macio e elástico.",
      icon: "hand",
    },
    {
      title: "Fermentação Lenta",
      description:
        "Para mais sabor, deixe a massa fermentar na geladeira por 8-12 horas. Isso desenvolve aromas complexos no pão.",
      icon: "clock",
    },
    {
      title: "Vapor no Forno",
      description:
        "Coloque uma forma com água quente no fundo do forno para criar vapor, o que ajuda na expansão do pão e na formação da crosta.",
      icon: "cloud",
    },
  ]

  useEffect(() => {
    // Atualiza o nível com base no XP atual
    let newLevel = 1
    for (let i = levels.length - 1; i >= 0; i--) {
      if (xp >= levels[i].xp) {
        newLevel = levels[i].level
        break
      }
    }

    if (newLevel > currentLevel) {
      // Subiu de nível
      setTimeout(() => {
        triggerConfetti()
      }, 300)
    }

    setCurrentLevel(newLevel)
  }, [xp, currentLevel])

  // Efeito para desbloquear receitas com base nas respostas corretas
  useEffect(() => {
    const newUnlockedRecipes = [...unlockedRecipes]

    recipeCollections.forEach((recipe) => {
      if (
        recipe.requiredCorrect &&
        correctAnswers >= recipe.requiredCorrect &&
        !newUnlockedRecipes.includes(recipe.id)
      ) {
        newUnlockedRecipes.push(recipe.id)

        // Mostrar notificação de nova receita desbloqueada
        if (correctAnswers > 0) {
          // Evita mostrar na inicialização
          setTimeout(() => {
            triggerConfetti()
          }, 300)
        }
      }
    })

    if (newUnlockedRecipes.length !== unlockedRecipes.length) {
      setUnlockedRecipes(newUnlockedRecipes)
    }
  }, [correctAnswers, unlockedRecipes])

  // Timer para a oferta limitada
  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft, timerActive])

  // Ativar o timer quando o usuário desbloquear a primeira receita
  useEffect(() => {
    if (unlockedRecipes.length > 0 && !timerActive) {
      setTimerActive(true)
    }
  }, [unlockedRecipes, timerActive])

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`
  }

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#FFD700", "#FFFFFF", "#8B4513"],
    })
  }

  const updateXP = (correct) => {
    if (correct) {
      setXp((prev) => prev + 25)
      setCorrectAnswers((prev) => prev + 1)
    } else {
      setXp((prev) => Math.max(0, prev - 10))
    }
  }

  const handleAnswerSubmit = () => {
    if (!selectedAnswer) return

    const currentQuestion = questions[currentQuestionIndex]
    const correct = selectedAnswer === currentQuestion.correct

    setIsCorrect(correct)
    setShowFeedback(true)
    updateXP(correct)

    if (correct) {
      triggerConfetti()
    }
  }

  const handleNextQuestion = () => {
    setShowFeedback(false)
    setSelectedAnswer("")

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    } else {
      setShowCompletionModal(true)
    }
  }

  const getCurrentLevelProgress = () => {
    const currentLevelXP = levels[currentLevel - 1].xp
    const nextLevelXP = currentLevel < levels.length ? levels[currentLevel].xp : currentLevelXP
    return currentLevel < levels.length
      ? Math.round(((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100)
      : 100
  }

  const getXPToNextLevel = () => {
    const nextLevelXP = currentLevel < levels.length ? levels[currentLevel].xp : levels[currentLevel - 1].xp
    return currentLevel < levels.length ? nextLevelXP - xp : 0
  }

  const renderIcon = (iconName) => {
    switch (iconName) {
      case "bread":
        return <Bread className="h-5 w-5" />
      case "flame":
        return <Flame className="h-5 w-5" />
      case "thermometer":
        return <Star className="h-5 w-5" />
      case "wheat":
        return <Wheat className="h-5 w-5" />
      case "clock":
        return <Clock className="h-5 w-5" />
      case "hourglass":
        return <Award className="h-5 w-5" />
      case "cloud":
        return <Gift className="h-5 w-5" />
      case "droplet":
        return <Gift className="h-5 w-5" />
      case "hand":
        return <Gift className="h-5 w-5" />
      case "scissors":
        return <Gift className="h-5 w-5" />
      case "pizza":
        return <Pizza className="h-5 w-5" />
      case "cake":
        return <Cake className="h-5 w-5" />
      case "utensils":
        return <Utensils className="h-5 w-5" />
      case "users":
        return <Users className="h-5 w-5" />
      case "sparkles":
        return <Sparkles className="h-5 w-5" />
      default:
        return <BookOpen className="h-5 w-5" />
    }
  }

  const getUnlockedBonuses = () => {
    return bonusItems.slice(0, Math.min(correctAnswers, bonusItems.length))
  }

  // In the handlePurchase function, keep it as is but add a comment about redirecting to checkout
  const handlePurchase = () => {
    setPurchaseLoading(true)

    // Simulação de processamento de pagamento
    setTimeout(() => {
      setPurchaseLoading(false)
      setPurchaseSuccess(true)

      // Na implementação real, redirecionar para o checkout externo
      // window.location.href = "https://seu-checkout-externo.com";

      // Mostrar confetti para celebrar a compra
      triggerConfetti()
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-[#FDF6E3] bg-[url('https://www.transparenttextures.com/patterns/flour.png')] p-4">
      <div className="max-w-4xl mx-auto">
      {/* Removido o título "Jogo de pães..." */}

      {/* Removido o timer da parte superior */}

      {/* Barra de XP e progresso mais atrativa */}
      <Card className="mb-6 overflow-hidden border border-amber-200 shadow-md">
  <CardContent className="p-4">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <div className="bg-amber-500 text-white p-1.5 rounded-full">
          <Star className="h-5 w-5" />
        </div>
        <span className="font-bold text-amber-800">
          Nível {currentLevel}: {levels[currentLevel - 1].name}
        </span>
      </div>
      <div className="text-sm font-medium text-amber-700">
        {xp} XP / {getXPToNextLevel()} XP para o próximo nível
      </div>
    </div>
    <div className="relative pt-1">
      <div className="flex mb-2 items-center justify-between">
        <div>
          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-amber-600 bg-amber-100">
            Progresso
          </span>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold inline-block text-amber-600">
            {getCurrentLevelProgress()}%
          </span>
        </div>
      </div>
      <div className="overflow-hidden h-2 mb-1 text-xs flex rounded bg-amber-100">
        <div
          style={{ width: `${getCurrentLevelProgress()}%` }}
          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-amber-400 to-amber-600"
        ></div>
      </div>
    </div>
  </CardContent>
</Card>

      <div className="bg-amber-50 border border-amber-200 p-3 rounded-md text-center mb-6 shadow-md">
        <div className="flex items-center justify-center gap-2 font-medium text-amber-800">
          <Trophy className="h-5 w-5 text-amber-600" />
          <span>
            Respostas corretas: {correctAnswers} de {questions.length}
          </span>
        </div>
        <p className="text-sm mt-1">Responda corretamente para desbloquear receitas exclusivas!</p>
      </div>

        <Tabs defaultValue="quiz" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="quiz">Jogo</TabsTrigger>
            <TabsTrigger value="recipes">
              Receitas ({unlockedRecipes.length})
              {unlockedRecipes.length > 0 && (
                <Badge variant="secondary" className="ml-2 bg-amber-200 text-amber-800">
                  Novo
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="tips">Dicas</TabsTrigger>
          </TabsList>

          <TabsContent value="quiz">
            <Card>
              <CardHeader>
                <CardTitle>Pergunta {currentQuestionIndex + 1} de {questions.length}</CardTitle>
                <CardDescription>
                  Responda corretamente para desbloquear receitas exclusivas!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-2xl font-medium text-center">{questions[currentQuestionIndex].question}</div>

                <div className="bg-amber-50 border border-amber-200 p-3 rounded-md text-center text-sm">
                  <Gift className="inline-block mr-2 h-4 w-4 text-amber-600" />
                  Desbloqueie as melhores receitas de pães fofinhos da internet!
                </div>

                {questions[currentQuestionIndex].image && (
                  <div className="flex justify-center my-4">
                    <img
                      src={questions[currentQuestionIndex].image || "/placeholder.svg"}
                      alt="Imagem da pergunta"
                      className="max-w-[70%] rounded-lg transition-transform hover:scale-[1.02]"
                    />
                  </div>
                )}

                <div className="pt-4">
                  <h3 className="text-center font-medium text-[#8B4513] mb-4 relative pb-2">
                    Escolha uma das respostas:
                    <span className="absolute bottom-0 left-[30%] right-[30%] h-0.5 bg-gradient-to-r from-transparent via-[#D2B48C] to-transparent"></span>
                  </h3>

                  <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer} className="space-y-3">
                    {questions[currentQuestionIndex].options.map((option, index) => (
                      <div
                        key={index}
                        className={`flex items-center rounded-lg border p-4 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-md ${
                          selectedAnswer === option.text ? "bg-amber-50 border-amber-300" : "bg-white border-gray-200"
                        }`}
                        onClick={() => setSelectedAnswer(option.text)}
                      >
                        <RadioGroupItem value={option.text} id={`option-${index}`} className="sr-only" />
                        <Label htmlFor={`option-${index}`} className="flex items-center w-full cursor-pointer">
                          <div className="bg-[#8B5A2B] text-white p-2 rounded-md mr-3">{renderIcon(option.icon)}</div>
                          <span className="text-lg">{option.text}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {showFeedback && (
                  <div
                    className={`mt-6 p-4 rounded-lg ${isCorrect ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
                  >
                    <h3 className={`text-xl font-bold ${isCorrect ? "text-green-700" : "text-red-700"}`}>
                      {isCorrect ? "Resposta Correta! ✅" : "Resposta Incorreta! ❌"}
                    </h3>
                    <p className="my-2">
                      {isCorrect
                        ? questions[currentQuestionIndex].feedbackCorrect
                        : questions[currentQuestionIndex].feedbackIncorrect}
                    </p>
                    <div className="mt-3 bg-white p-3 rounded border">
                      <h4 className="font-bold text-[#8B4513]">Explicação:</h4>
                      <p>{questions[currentQuestionIndex].explanation}</p>
                    </div>

                    {isCorrect && questions[currentQuestionIndex].bonus && (
                      <div className="mt-4 bg-amber-100 p-3 rounded-lg border border-amber-300">
                        <h4 className="font-bold text-amber-800 flex items-center">
                          <Gift className="h-5 w-5 mr-2" />
                          Bônus Desbloqueado!
                        </h4>
                        <p className="text-amber-800">{questions[currentQuestionIndex].bonus}</p>
                      </div>
                    )}

                    {isCorrect && correctAnswers % 2 === 0 && correctAnswers > 0 && (
                      <div className="mt-4 bg-amber-100 p-3 rounded-lg border border-amber-300">
                        <h4 className="font-bold text-amber-800 flex items-center">
                          <Unlock className="h-5 w-5 mr-2" />
                          Nova Receita Desbloqueada!
                        </h4>
                        <p className="text-amber-800">
                          Você desbloqueou: {recipeCollections.find((r) => r.requiredCorrect === correctAnswers)?.title}
                        </p>
                        <Button
                          variant="outline"
                          className="mt-2 bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-200"
                          onClick={() => setActiveTab("recipes")}
                        >
                          Ver Receita
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                {!showFeedback ? (
                  <Button
                    onClick={handleAnswerSubmit}
                    disabled={!selectedAnswer}
                    className="w-full bg-gradient-to-r from-[#FFC107] to-[#FFA000] hover:from-[#FFA000] hover:to-[#FF8F00] text-white"
                  >
                    Verificar Resposta
                  </Button>
                ) : (
                  <Button
                    onClick={handleNextQuestion}
                    className="w-full bg-gradient-to-r from-[#8B4513] to-[#A67B5B] hover:from-[#A67B5B] hover:to-[#8B4513] text-white"
                  >
                    {currentQuestionIndex < questions.length - 1 ? "Próxima Pergunta" : "Ver Resultados"}
                  </Button>
                )}
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="recipes" className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-md mb-4">
              <h3 className="font-medium text-amber-800 flex items-center gap-2 mb-2">
                <AlertCircle className="h-5 w-5" />
                Como funciona:
              </h3>
              <p className="text-sm">
                Ao responder corretamente as perguntas do jogo, você desbloqueia mais receitas. Quanto mais perguntas
                você acertar, mais receitas serão desbloqueadas! Para acessar todas as receitas desbloqueadas, é
                necessário fazer a compra final.
              </p>
            </div>

            {timerActive && (
              <div className="bg-red-50 border-2 border-red-500 p-3 rounded-md text-center mb-4">
                <div className="flex items-center justify-center gap-2 font-bold text-red-700">
                  <Timer className="h-5 w-5" />
                  <span>OFERTA EXPIRA EM: {formatTime(timeLeft)}</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recipeCollections.map((recipe, index) => (
                recipe.id !== 1 && (
                  <Card
                    key={index}
                    className={`overflow-hidden ${unlockedRecipes.includes(recipe.id) ? "" : "opacity-70"}`}
                  >
                    <div className="relative">
                      <img
                        src={recipe.image || "/placeholder.svg"}
                        alt={recipe.title}
                        className="w-full h-40 object-cover"
                      />
                      {!unlockedRecipes.includes(recipe.id) && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <div className="text-center text-white">
                            <Lock className="h-8 w-8 mx-auto mb-2" />
                            <p>Desbloqueie com {recipe.requiredCorrect} respostas corretas</p>
                          </div>
                        </div>
                      )}
                      {unlockedRecipes.includes(recipe.id) && (
                        <div className="absolute top-2 right-2 flex items-center gap-1">
                          <Badge className="bg-green-500 flex items-center gap-1">
                            <Trophy className="h-3.5 w-3.5" />
                            Desbloqueado
                          </Badge>
                        </div>
                      )}
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-xl flex items-center gap-2">
                          {renderIcon(recipe.icon)}
                          {recipe.title}
                        </CardTitle>
                      </div>
                      <CardDescription>{recipe.description}</CardDescription>
                    </CardHeader>
                    <CardFooter className="flex flex-col items-start">
                      <div className="mb-2 w-full">
                        {unlockedRecipes.includes(recipe.id) ? (
                          <div className="flex items-center">
                            <span className="line-through text-gray-500 mr-2">R${recipe.originalPrice.toFixed(2)}</span>
                            <span className="text-green-600 font-bold">R${recipe.price.toFixed(2)}</span>
                            <Badge className="ml-auto bg-amber-100 text-amber-800 hover:bg-amber-200">Desbloqueado</Badge>
                          </div>
                        ) : (
                          <div>
                            <span className="text-gray-500">R${recipe.originalPrice.toFixed(2)}</span>
                          </div>
                        )}
                      </div>
                      <Button
                        className="w-full"
                        variant={unlockedRecipes.includes(recipe.id) ? "default" : "outline"}
                        disabled={!unlockedRecipes.includes(recipe.id)}
                        onClick={() => setShowCompletionModal(true)}
                      >
                        {unlockedRecipes.includes(recipe.id) ? "Ver Receita" : "Bloqueado"}
                      </Button>
                    </CardFooter>
                  </Card>
                )
              ))}
            </div>

            {unlockedRecipes.length > 0 && (
              <Card className="mt-6 bg-amber-50 border-amber-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Acesse Todas as Receitas Desbloqueadas
                  </CardTitle>
                  <CardDescription>
                    Você já desbloqueou {unlockedRecipes.length} receitas exclusivas! Acesse todas elas agora mesmo.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-2xl font-bold text-green-600">300 Receitas Exclusivas</div>
                      <div className="text-sm text-green-700">
                        Incluindo {unlockedRecipes.length} receitas que você já desbloqueou!
                      </div>
                    </div>
                    <Badge className="bg-green-500 text-white text-lg py-1 px-3">
                      Aprenda Agora
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-lg py-6"
                    onClick={() => setShowPurchaseModal(true)}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Eu quero todas receitas com desconto!
                  </Button>
                </CardFooter>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="tips" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tips.map((tip, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {renderIcon(tip.icon)}
                      {tip.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{tip.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            {getUnlockedBonuses().map((bonus, index) => (
              <Card key={`bonus-${index}`} className="bg-amber-50 border-amber-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {renderIcon(bonus.icon)}
                    {bonus.title}
                    <Badge className="ml-2 bg-green-100 text-green-800">Bônus</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{bonus.description}</p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

{showCompletionModal && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
    <Card className="max-w-xl w-full overflow-y-auto max-h-[90vh]">
      <div className="bg-gradient-to-r from-amber-400 to-amber-600 text-white p-5">
        <CardTitle className="text-3xl text-center">Parabéns, {levels[currentLevel - 1].name}! 🎉</CardTitle>
        <CardDescription className="text-center text-white/90 text-lg mt-1">
          Você completou o jogo com {xp} XP e desbloqueou {unlockedRecipes.length} receitas!
        </CardDescription>
      </div>
      <CardContent className="space-y-4 p-6">
        
        <div className="bg-amber-50 p-4 rounded-lg border-2 border-amber-300">
          <h3 className="font-bold text-amber-800 flex items-center gap-2 text-lg">
            <Trophy className="h-6 w-6 text-amber-600" />
            Receitas Desbloqueadas: {unlockedRecipes.length}
          </h3>
          
          {/* Receita principal com destaque */}
          <div className="mt-4 mb-4 bg-green-100 p-4 rounded-lg border-2 border-green-500 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Bread className="h-7 w-7 text-amber-700 bg-amber-100 p-1 rounded-full mr-2" />
                <div>
                  <h4 className="font-bold text-lg">300 Melhores Receitas de pães fofinhos que crescem muito! + Bônus</h4>
                  <p className="text-sm text-gray-600">A coleção completa com todas as técnicas e segredos</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">6x de R$ 6,16 ou</div>
                <div className="text-3xl font-bold text-green-600">Apenas R$37,00</div>
                <div className="text-sm text-green-700 font-medium">À vista no Pix ou Cartão</div>
              </div>
            </div>
          </div>
          
          <ul className="mt-2 space-y-2 divide-y divide-amber-200">
            {recipeCollections.filter(r => r.id !== 1 && unlockedRecipes.includes(r.id)).map((recipe, index) => (
              <li key={index} className="flex items-center justify-between pt-2">
                <span className="flex items-center">
                  {renderIcon(recipe.icon)}
                  <span className="ml-2">{recipe.title}</span>
                </span>
                <span className="text-green-600 font-semibold">
                  <span className="line-through text-gray-500 mr-1">R$19,90</span>
                  <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-bold">Grátis</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg border-2 border-green-300 mt-4">
          <h3 className="font-bold text-green-800 flex items-center gap-2 text-lg">
            <Gift className="h-6 w-6 text-green-600" />
            Bônus Desbloqueados:
          </h3>
          <ul className="mt-2 space-y-2">
            {getUnlockedBonuses().map((bonus, index) => (
              <li key={index} className="flex items-center bg-white p-3 rounded border border-green-200">
                {renderIcon(bonus.icon)}
                <span className="ml-2 text-base">{bonus.title}</span>
              </li>
            ))}
          </ul>
        </div>
        
        
      <div className="bg-amber-50 p-5 rounded-lg border-2 border-amber-300 mb-4">
          <h3 className="font-bold text-center text-2xl mb-3 text-amber-800">
            PARABÉNS! VOCÊ DESBLOQUEOU UMA OFERTA ESPECIAL
          </h3>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm text-gray-600">6x de R$ 6,16 ou</div>
              <div className="text-3xl font-bold text-green-600">Apenas R$37,00</div>
              <div className="text-sm text-green-700 font-medium">À vista no Pix ou Cartão</div>
            </div>
            <Badge className="bg-red-600 text-white text-xl py-1.5 px-3 rotate-3 transform">-81%</Badge>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 p-6 bg-gray-50 border-t">
        <Button
          variant="outline"
          onClick={() => {
            setShowCompletionModal(false)
            setActiveTab("recipes")
          }}
          className="flex-1"
        >
          Ver Receitas
        </Button>
        <Button
          onClick={() => {
            setShowCompletionModal(false)
            setShowPurchaseModal(true)
          }}
          className="flex-1 bg-green-600 hover:bg-green-700 text-lg py-6"
        >
          Acessar Agora
        </Button>
      </CardFooter>
    </Card>
  </div>
)}

{showPurchaseModal && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
    <Card className="max-w-xl w-full overflow-y-auto max-h-[90vh]">
      <div className="bg-gradient-to-r from-green-500 to-green-700 text-white p-6">
        <CardTitle className="text-2xl text-center">Acesse Todas as Receitas</CardTitle>
        <CardDescription className="text-center text-white/90 mt-1">
          {purchaseSuccess
            ? "Parabéns pela sua compra!"
            : "Desbloqueie receitas exclusivas com um único pagamento"}
        </CardDescription>
      </div>
      <CardContent className="space-y-6 p-6">
        {!purchaseSuccess ? (
          <>
            <div className="bg-red-50 border-2 border-red-500 p-3 rounded-md text-center mb-4">
              <div className="flex items-center justify-center gap-2 font-bold text-red-700">
                <Timer className="h-5 w-5" />
                <span>ESSA OFERTA ESPECIAL EXPIRA EM: {formatTime(timeLeft)}</span>
              </div>
            </div>

            <div className="bg-amber-50 p-4 rounded-lg border-2 border-amber-300">
              <h3 className="font-bold text-amber-800 text-lg flex items-center gap-2">
                <Gift className="h-5 w-5 text-amber-700" />
                O que você vai receber:
              </h3>
              <ul className="mt-4 space-y-3">
                <li className="flex items-center gap-3 bg-white p-3 rounded-md border border-amber-200">
                  <Bread className="h-6 w-6 text-amber-700 bg-amber-100 p-1 rounded-full" />
                  <div>
                    <div className="font-medium">300 Receitas de Pães Caseiros Fofinhos</div>
                    <div className="text-xs text-gray-500">A coleção completa com todas as técnicas</div>
                  </div>
                </li>
                <li className="flex items-center gap-3 bg-white p-3 rounded-md border border-amber-200">
                  <Utensils className="h-6 w-6 text-amber-700 bg-amber-100 p-1 rounded-full" />
                  <div>
                    <div className="font-medium">75 Receitas de Tortas Salgadas</div>
                    <div className="text-xs text-gray-500">Perfeitas para festas e eventos</div>
                  </div>
                </li>
                <li className="flex items-center gap-3 bg-white p-3 rounded-md border border-amber-200">
                  <Pizza className="h-6 w-6 text-amber-700 bg-amber-100 p-1 rounded-full" />
                  <div>
                    <div className="font-medium">80 Receitas de Pizzas Artesanais</div>
                    <div className="text-xs text-gray-500">Com massa perfeita e coberturas deliciosas</div>
                  </div>
                </li>
                <li className="flex items-center gap-3 bg-white p-3 rounded-md border border-amber-200">
                  <Cake className="h-6 w-6 text-amber-700 bg-amber-100 p-1 rounded-full" />
                  <div>
                    <div className="font-medium">120 Receitas de Bolos e Sobremesas</div>
                    <div className="text-xs text-gray-500">Doces irresistíveis para todas as ocasiões</div>
                  </div>
                </li>
                <li className="flex items-center gap-3 bg-white p-3 rounded-md border border-amber-200">
                  <Users className="h-6 w-6 text-amber-700 bg-amber-100 p-1 rounded-full" />
                  <div>
                    <div className="font-medium">Acesso ao Grupo VIP de Suporte</div>
                    <div className="text-xs text-gray-500">Tire dúvidas diretamente com chefs profissionais</div>
                  </div>
                </li>
                <li className="flex items-center gap-3 bg-white p-3 rounded-md border border-amber-200 border-green-300">
                  <Trophy className="h-6 w-6 text-green-600 bg-green-100 p-1 rounded-full" />
                  <div>
                    <div className="font-medium text-green-700">+ Todas as receitas desbloqueadas</div>
                    <div className="text-xs text-gray-500">Acesso imediato a todas as receitas que você já desbloqueou</div>
                  </div>
                </li>
              </ul>
            </div>
      
      <div className="bg-amber-100 p-4 rounded-lg border-2 border-amber-300">
        <h3 className="font-bold text-amber-800 flex items-center gap-2">
          <Gift className="h-5 w-5" />
          Mais todos os bônus e troques da página anterior!
        </h3>
        <p className="text-sm text-amber-700 mt-1">
          Você receberá acesso a todas as receitas desbloqueadas e todos os bônus exclusivos em um único pacote.
        </p>
      </div>

      <div className="flex items-center justify-between p-4 bg-green-50 border-2 border-green-300 rounded-lg">
        <div>
          <div className="text-sm text-gray-600">6x de R$ 6,16 ou</div>
          <div className="text-3xl font-bold text-green-600">Apenas R$37,00</div>
          <div className="text-sm text-green-700 font-medium">À vista no Pix ou Cartão</div>
        </div>
        <Badge className="bg-red-600 text-white text-xl py-1.5 px-3 rotate-3 transform">-81%</Badge>
      </div>
      
      <Button
        className="w-full bg-green-600 hover:bg-green-700 text-xl py-8 font-bold shadow-lg rounded-full"
        style={pulseAnimation}
        onClick={handlePurchase}
        disabled={purchaseLoading}
      >
        {purchaseLoading ? (
          "Processando..."
        ) : (
          <>
            <ShoppingCart className="mr-2 h-6 w-6" />
            Eu quero as receitas!
          </>
        )}
      </Button>
      
      <div className="flex justify-center mt-2">
        <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Lock className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-gray-700">Pagamento 100% Seguro e Confiável</span>
          </div>
          <div className="text-xs text-gray-500">Seus dados estão protegidos e criptografados</div>
        </div>
      </div>
      
      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mt-3">
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-blue-600" />
          <span className="font-medium text-blue-800">Garantia de 90 dias</span>
        </div>
        <p className="text-sm text-blue-700 mt-1">
          Conforme o Código de Defesa do Consumidor, você tem 90 dias de garantia. Se não ficar satisfeito, devolvemos seu dinheiro.
        </p>
      </div>
    </>
  ) : (
    <>
    <div className="mt-8 border-t border-gray-200 pt-6">
      <h3 className="text-xl font-bold text-center mb-4">Como funciona:</h3>
      <div className="space-y-6">
        <div className="flex items-start gap-3">
          <div className="bg-green-100 rounded-full w-8 h-8 flex items-center justify-center text-green-700 font-bold flex-shrink-0">1</div>
          <div>
            <h4 className="font-bold text-gray-800">Liberando o acesso:</h4>
            <p className="text-gray-600">Basta clicar no botão para desbloquear seu acesso a todas as receitas e seus bônus que você conquistou!</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="bg-green-100 rounded-full w-8 h-8 flex items-center justify-center text-green-700 font-bold flex-shrink-0">2</div>
          <div>
            <h4 className="font-bold text-gray-800">Pague com Pix ou Cartão:</h4>
            <p className="text-gray-600">Você escolhe como quer pagar! Finalize sua compra para receber tudo imediatamente no email e whatsapp.</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="bg-green-100 rounded-full w-8 h-8 flex items-center justify-center text-green-700 font-bold flex-shrink-0">3</div>
          <div>
            <h4 className="font-bold text-gray-800">Receba seu acesso:</h4>
            <p className="text-gray-600">Você receberá o link para o acesso ao acervo completo de todas as receitas e bônus de suas conquistas!</p>
          </div>
        </div>
      </div>
    </div>

    <div className="mt-8 border-t border-gray-200 pt-6">
      <h3 className="text-xl font-bold text-center mb-4">O que dizem nossos clientes:</h3>
      <div className="space-y-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <img 
              src="https://infosaber.online/wp-content/uploads/2025/03/Design-sem-nome-1.png-633x1024.webp" 
              alt="Depoimento de cliente" 
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h4 className="font-bold">Maria Silva</h4>
              <div className="flex text-amber-400">
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
              </div>
            </div>
          </div>
          <p className="text-gray-600 italic">"Essas receitas transformaram minha forma de fazer pães! Agora todos os meus pães ficam fofos e crescem muito. Minha família adora!"</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <img 
              src="https://infosaber.online/wp-content/uploads/2025/03/Design-sem-nome-2-864x1536-1-576x1024.png" 
              alt="Depoimento de cliente" 
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h4 className="font-bold">João Oliveira</h4>
              <div className="flex text-amber-400">
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
              </div>
            </div>
          </div>
          <p className="text-gray-600 italic">"Nunca imaginei que conseguiria fazer pães tão profissionais em casa! As técnicas são simples de seguir e os resultados são incríveis. Recomendo muito!"</p>
        </div>
      </div>
    </div>
  </>
  )}
</CardContent>
      <CardFooter className="flex flex-col gap-2 p-6 bg-gray-50 border-t">
        {!purchaseSuccess ? (
          <Button
            className="w-full"
            onClick={() => {
              setShowPurchaseModal(false)
              setActiveTab("recipes")
            }}
          >
            Voltar
          </Button>
        ) : (
          <Button
            className="w-full"
            onClick={() => {
              setShowPurchaseModal(false)
              setActiveTab("recipes")
            }}
          >
            Continuar
          </Button>
        )}
      </CardFooter>
    </Card>
  </div>
)}
      </div>
    </div>
  )
}
