"""
Curated sample presets and high-fidelity fallbacks for SmartStudy AI.
Provides instant 1-click test data for students and evaluators.
"""

SAMPLE_PRESETS = {
    "summarize": {
        "title": "Cellular Respiration & ATP Production",
        "notes": """Cellular respiration is a series of chemical reactions that break down glucose to produce ATP, which may be used as energy to power reactions throughout the body. There are three main stages of cellular respiration: glycolysis, the citric acid cycle (Krebs cycle), and oxidative phosphorylation.

Stage 1: Glycolysis
Glycolysis takes place in the cytoplasm and does not require oxygen (anaerobic). During glycolysis, a 6-carbon glucose molecule is broken down into two 3-carbon pyruvate molecules. This process consumes 2 ATP molecules but produces 4 ATP molecules and 2 NADH molecules, yielding a net gain of 2 ATP and 2 NADH.

Stage 2: The Krebs Cycle (Citric Acid Cycle)
Pyruvate moves into the mitochondrial matrix. It is converted into Acetyl-CoA before entering the Krebs cycle. Each Acetyl-CoA yields 3 NADH, 1 FADH2, and 1 ATP (or GTP), along with carbon dioxide as a waste product. Because two pyruvates were produced from each glucose, the cycle turns twice per glucose molecule.

Stage 3: Oxidative Phosphorylation (Electron Transport Chain & Chemiosmosis)
Taking place on the inner mitochondrial membrane, high-energy electrons from NADH and FADH2 are transferred along an electron transport chain. As electrons pass through protein complexes I-IV, protons (H+) are pumped into the intermembrane space, establishing an electrochemical proton gradient. Protons flow back through ATP synthase (chemiosmosis), generating approximately 26 to 28 ATP molecules. Oxygen serves as the final electron acceptor, combining with protons to form water.

Overall, one molecule of glucose generates a theoretical maximum of 30 to 32 ATP under optimal aerobic conditions."""
    },
    "quiz": {
        "topic": "Machine Learning Fundamentals & Overfitting",
        "content": """Machine learning models learn patterns from training data to make predictions on unseen test data. A central challenge in supervised learning is the bias-variance tradeoff.

Overfitting occurs when a model learns the training data too well, capturing noise and idiosyncrasies rather than the underlying generalizable pattern. As a result, the model exhibits very low training error but high test/validation error. Complex models, such as deep neural networks without regularization or high-degree polynomial regressions, are especially prone to overfitting.

Common techniques to combat overfitting include:
1. Regularization (L1 Lasso which induces sparsity, and L2 Ridge which penalizes large weights).
2. Cross-Validation (such as K-Fold cross-validation) to evaluate performance across independent data folds.
3. Dropout in neural networks, randomly deactivating neurons during training.
4. Early Stopping, halting training when validation loss begins to diverge.
5. Data Augmentation and gathering more training samples."""
    },
    "improve_answer": {
        "question": "Explain the economic concept of Opportunity Cost and evaluate its significance in consumer and governmental decision-making.",
        "draft": """Opportunity cost is the next best thing you give up when you make a choice. Like if I buy a pizza, I can't buy a movie ticket. It is important for consumers because money is limited so you have to choose what you want more. Governments also have opportunity costs because taxes are limited, so if they build a new road they have less money for hospitals and schools. Therefore people and governments need to think about what they lose when making decisions."""
    },
    "explain_concept": {
        "concept": "Distributed Consensus and the Byzantine Generals Problem in Blockchain",
        "depth": "intuitive"
    }
}

DEMO_RESPONSES = {
    "summarize": {
        "title": "Cellular Respiration & ATP Production",
        "overview": "Cellular respiration is the biochemical pathway converting glucose into usable cellular energy (ATP) through three interconnected stages: Glycolysis, the Citric Acid Cycle, and Oxidative Phosphorylation.",
        "keyTakeaways": [
            "Glycolysis occurs anaerobically in the cytoplasm, yielding a net 2 ATP and 2 NADH.",
            "The Citric Acid Cycle occurs in the mitochondrial matrix, producing NADH, FADH2, and CO2 byproducts.",
            "Oxidative Phosphorylation uses an electron transport chain and chemiosmosis on the inner membrane to generate ~26-28 ATP.",
            "Oxygen is the critical final electron acceptor, forming H2O and preventing electron transport stall."
        ],
        "bulletSummary": [
            {
                "topic": "Glycolysis (Cytoplasm)",
                "details": "Splits 6C glucose into two 3C pyruvates. Consumes 2 ATP, yields 4 ATP (net 2 ATP) + 2 NADH."
            },
            {
                "topic": "Krebs / Citric Acid Cycle (Matrix)",
                "details": "Converts pyruvate to Acetyl-CoA. Turns twice per glucose to generate 6 NADH, 2 FADH2, 2 ATP, and CO2 waste."
            },
            {
                "topic": "Electron Transport Chain & Chemiosmosis",
                "details": "Pumps protons across inner mitochondrial membrane to create an electrochemical gradient that drives ATP Synthase."
            }
        ],
        "importantFormulasOrTerms": [
            {
                "term": "ATP Synthase",
                "definition": "The molecular turbine enzyme that synthesizes ATP from ADP + Pi using proton motive force."
            },
            {
                "term": "Chemiosmosis",
                "definition": "The movement of ions across a semipermeable membrane down their electrochemical gradient."
            },
            {
                "term": "Proton Gradient",
                "definition": "The accumulation of H+ ions in the intermembrane space driving cellular work."
            }
        ],
        "examTips": [
            "Always state that Glycolysis is anaerobic and takes place in the cytoplasm, not the mitochondria.",
            "Remember that 1 glucose yields 2 turns of the Krebs cycle because it splits into 2 pyruvates.",
            "Oxidative phosphorylation produces the overwhelming majority of ATP (roughly 85-90% of total yield)."
        ]
    },
    "quiz": {
        "topic": "Machine Learning Fundamentals & Overfitting",
        "questions": [
            {
                "id": 1,
                "question": "What is the primary diagnostic symptom of an overfitted machine learning model?",
                "options": [
                    "High training error and high validation error",
                    "Low training error coupled with significantly higher validation error",
                    "Extremely long training times with low model parameter counts",
                    "Identical error rates across both training and independent test partitions"
                ],
                "correctAnswer": 1,
                "explanation": "Overfitting is characterized by low training loss (the model memorized the training sample and noise) alongside high validation or test loss (failure to generalize to new, unseen data)."
            },
            {
                "id": 2,
                "question": "How does L1 Regularization (Lasso) fundamentally differ from L2 Regularization (Ridge)?",
                "options": [
                    "L1 adds a penalty proportional to the sum of squared weights, preventing extreme values",
                    "L1 drives irrelevant feature weights strictly to zero, effectively performing automatic feature selection",
                    "L1 can only be applied to classification problems, while L2 is exclusively for regression",
                    "L1 increases model variance while L2 always decreases model bias"
                ],
                "correctAnswer": 1,
                "explanation": "L1 regularization adds an absolute value penalty (|w|), creating sharp corner optima that set redundant feature weights exactly to zero, producing sparse models."
            },
            {
                "id": 3,
                "question": "Why is Early Stopping considered an effective regularizer in iterative model training?",
                "options": [
                    "It shrinks the dataset to prevent models from seeing outlier instances",
                    "It halts optimization at the inflection point where validation loss begins to degrade, before the model memorizes training noise",
                    "It doubles the learning rate to bypass local minima quickly",
                    "It eliminates the need for any train-validation split"
                ],
                "correctAnswer": 1,
                "explanation": "Early stopping monitors a validation metric and halts gradient descent when validation performance plateaus or worsens, capturing the model at its peak generalization capability."
            },
            {
                "id": 4,
                "question": "In the context of the bias-variance tradeoff, an underfitted model typically exhibits:",
                "options": [
                    "High variance and low bias",
                    "High bias and low variance",
                    "High bias and high variance",
                    "Zero training error and high test error"
                ],
                "correctAnswer": 1,
                "explanation": "Underfitting occurs when a model is overly simplistic (e.g. linear model on quadratic data). It has high bias because it makes erroneous structural assumptions, and low variance because it changes little across different training samples."
            },
            {
                "id": 5,
                "question": "Which of the following techniques prevents co-adaptation of feature detectors in deep neural networks during training?",
                "options": [
                    "K-Fold Cross Validation",
                    "Dropout",
                    "Batch Normalization only during inference",
                    "Softmax Activation"
                ],
                "correctAnswer": 1,
                "explanation": "Dropout randomly sets a fraction of input units to 0 at each update during training, which prevents neurons from co-adapting and forces the network to learn robust, distributed representations."
            }
        ]
    },
    "improve_answer": {
        "question": "Explain the economic concept of Opportunity Cost and evaluate its significance in consumer and governmental decision-making.",
        "scoreAssessment": {
            "originalScore": "5.5/10",
            "improvedScore": "9.5/10",
            "gradeLevel": "Elevated from Satisfactory (C+) to Exemplary (A+)",
            "evaluationSummary": "The original answer correctly stated the textbook definition and gave intuitive examples, but lacked academic terminology (scarcity, marginal utility, PPC/PPF, fiscal tradeoffs), analytical depth, and formal structure."
        },
        "critique": {
            "strengths": [
                "Accurate baseline definition of opportunity cost as the next-best foregone alternative.",
                "Appropriate real-life examples for both private individuals and public expenditure."
            ],
            "weaknesses": [
                "Did not establish the foundational axiom of economics: scarcity and finite resources vs. unlimited wants.",
                "Lacked formal economic vocabulary such as marginal utility, Production Possibility Frontier (PPF), and fiscal budget constraints.",
                "Structure was conversational rather than an analytical exam essay format."
            ]
        },
        "improvedAnswer": "At the cornerstone of economic theory lies the problem of scarcity: resources are fundamentally finite while human wants are unlimited. Consequently, every economic decision necessitates trade-offs. Opportunity cost represents the real cost of an economic action, formally defined as the quantifiable and qualitative value of the next-best alternative foregone when a choice is made.\n\nIn consumer decision-making, individuals navigate choices under constrained personal budgets and finite time. Rational consumers optimize resource allocation by equating the marginal utility per unit of currency across goods. For instance, allocating discretionary income toward current consumption (e.g. dining or leisure) incurs the opportunity cost of foregone compound returns from financial savings or capital investments. Recognising opportunity costs mitigates behavioral irrationalities like sunk cost fallacy and short-term hyperbolic discounting.\n\nAt the macroeconomic level, governments operate along a national Production Possibility Frontier (PPF). With finite tax revenues and sovereign borrowing ceilings, public expenditure decisions involve significant societal trade-offs. For example, allocating budgetary capital toward expanded defense initiatives directly foregoes investment in public healthcare infrastructure or human capital formation (education). Evaluating opportunity costs ensures policymakers conduct rigorous cost-benefit analyses, accounting for negative externalities and long-term socio-economic productivity.\n\nIn conclusion, opportunity cost is not merely an abstract accounting figure, but an essential analytical mechanism for evaluating trade-offs, enabling both private agents and sovereign governments to achieve Pareto-efficient resource allocation.",
        "structureBreakdown": {
            "introduction": "Grounds the concept in economic scarcity, finite resources, and the formal definition of the next-best foregone alternative.",
            "coreArguments": [
                "Consumer optimization: budget constraints, marginal utility, and long-term capital tradeoffs.",
                "Governmental policymaking: Production Possibility Frontier (PPF), public fiscal constraints, and societal welfare prioritization."
            ],
            "conclusion": "Synthesizes the micro and macro dimensions into Pareto efficiency and strategic cost-benefit analysis."
        },
        "academicVocabularyAdded": [
            {
                "term": "Scarcity & Resource Allocation",
                "whyItMatters": "Establishes the fundamental premise of economic reasoning."
            },
            {
                "term": "Marginal Utility",
                "whyItMatters": "Formalizes consumer satisfaction per dollar spent."
            },
            {
                "term": "Production Possibility Frontier (PPF)",
                "whyItMatters": "Demonstrates graphical and theoretical comprehension of governmental tradeoffs."
            },
            {
                "term": "Pareto Efficiency",
                "whyItMatters": "Shows sophisticated understanding of welfare economics."
            }
        ],
        "keyTipsForStudent": [
            "In economics exam answers, always mention scarcity before defining opportunity cost.",
            "Link consumer decisions to 'marginal utility' and government decisions to 'Production Possibility Frontier' or 'fiscal constraints'."
        ]
    },
    "explain_concept": {
        "concept": "Distributed Consensus and the Byzantine Generals Problem in Blockchain",
        "oneLineDefinition": "A mathematical and game-theoretic protocol allowing independent, distrusting computers across a network to agree on a single source of truth without any central authority.",
        "simpleAnalogy": "Imagine four army generals surrounding an enemy castle who can only communicate by messenger pigeon. Some messengers might get captured, and some generals might secretly be traitors sending conflicting orders. To win, all loyal generals must attack at the exact same moment. The Byzantine Generals Problem is: how can they be 100% certain everyone agrees on the plan when nobody can be blindly trusted?",
        "stepByStepExplanation": [
            {
                "step": 1,
                "title": "The Trust Problem in Decentralization",
                "description": "Without a central bank or server (like Google or Visa), computers (nodes) must broadcast transactions directly to peer computers, risking fraudulent or conflicting records."
            },
            {
                "step": 2,
                "title": "Proof of Work / Cryptographic Stakes",
                "description": "To prevent dishonest nodes from spamming conflicting ledgers, the network demands proof of computational effort (mining) or economic collateral (staking) to propose the next block."
            },
            {
                "step": 3,
                "title": "The Longest Chain Rule",
                "description": "Every computer agrees on the canonical history by always following the valid chain that has accumulated the most proven cryptographic work."
            },
            {
                "step": 4,
                "title": "Game-Theoretic Finality",
                "description": "It becomes exponentially more expensive to rewrite history than to cooperate honestly, aligning economic incentives with network security."
            }
        ],
        "realWorldExamples": [
            {
                "scenario": "Bitcoin & Ethereum Ledgers",
                "application": "Ensures that digital money cannot be 'double-spent' (spent twice in two places) even when tens of thousands of anonymous computers handle the ledger."
            },
            {
                "scenario": "Autonomous Aerospace & Satellite Swarms",
                "application": "Allows satellite constellations to coordinate orbital trajectories and target tracking without single points of hardware failure."
            }
        ],
        "commonMisconceptions": [
            {
                "myth": "Blockchain consensus means no computers ever fail or lie.",
                "reality": "Consensus algorithms tolerate a threshold of bad actors (e.g. up to 33% or 50% malicious nodes) while maintaining 100% correct ledger state."
            },
            {
                "myth": "Consensus requires a fast central server to adjudicate conflicts.",
                "reality": "It is completely peer-to-peer; deterministic mathematical rules allow every node to independently arrive at identical conclusions."
            }
        ],
        "memoryHook": "Remember 'B-G-C': Bad Generals Caught — Blockchain Gives Consensus through proof and incentives!"
    }
}
